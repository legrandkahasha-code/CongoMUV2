import { useState, useEffect, FC } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, CheckCircle } from 'lucide-react';

interface DigitalTicketModalProps {
  bookingId: string;
  onClose: () => void;
}

interface Ticket {
  id: string;
  ticket_reference: string;
  qr_code: string;
  expiration_date: string;
  booking: {
    booking_reference: string;
    trip: {
      departure_city: string;
      arrival_city: string;
      departure_time: string;
      vehicle_number?: string;
      operator_name?: string;
    };
    passenger_details: Array<{
      full_name: string;
      age: number;
    }>;
    total_amount: number;
  };
  email_sent: boolean;
  sms_sent: boolean;
}

 

export const DigitalTicketModal: FC<DigitalTicketModalProps> = ({ bookingId, onClose }) => {
  if (!bookingId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h3 className="text-lg font-medium text-gray-900">Erreur</h3>
          <p className="mt-2 text-sm text-gray-600">Aucun identifiant de réservation fourni.</p>
          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Fermer</button>
          </div>
        </div>
      </div>
    );
  }

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingSMS, setSendingSMS] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const stored = localStorage.getItem(`ticket_${bookingId}`);
        if (stored) {
          const parsed: Ticket = JSON.parse(stored);
          if (!parsed.qr_code) {
            try {
              const payload = {
                t: 'CongoMuvTicket',
                id: parsed.id,
                ref: parsed.ticket_reference,
                booking_ref: parsed.booking.booking_reference,
                route: `${parsed.booking.trip.departure_city}->${parsed.booking.trip.arrival_city}`,
                dt: parsed.booking.trip.departure_time,
                exp: parsed.expiration_date
              };
              parsed.qr_code = await QRCode.toDataURL(JSON.stringify(payload), { errorCorrectionLevel: 'M', margin: 1, width: 240 });
              localStorage.setItem(`ticket_${bookingId}`, JSON.stringify(parsed));
            } catch {}
          }
          setTicket(parsed);
          setLoading(false);
          return;
        }
        const demoBookings = JSON.parse(localStorage.getItem('demo_bookings') || '[]');
        const booking = demoBookings.find((b: any) => String(b.id) === String(bookingId));
        if (!booking) throw new Error('Réservation non trouvée');
        const newTicket: Ticket = {
          id: `ticket-${bookingId}`,
          ticket_reference: `TK-CM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          qr_code: '',
          expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          booking: {
            booking_reference: String(bookingId),
            trip: booking.trip || {
              departure_city: booking.departure_city || 'Ville de départ',
              arrival_city: booking.arrival_city || "Ville d'arrivée",
              departure_time: booking.departure_time || new Date().toISOString(),
              vehicle_number: booking.trip?.vehicle_number || `TC-${Math.floor(100 + Math.random() * 900)}`,
              operator_name: booking.trip?.operator_name || 'CongoMuv'
            },
            passenger_details: booking.passenger_details || [{ full_name: 'Passager', age: 30 }],
            total_amount: booking.total_amount || 0
          },
          email_sent: false,
          sms_sent: false
        };
        try {
          const payload = {
            t: 'CongoMuvTicket',
            id: newTicket.id,
            ref: newTicket.ticket_reference,
            booking_ref: newTicket.booking.booking_reference,
            route: `${newTicket.booking.trip.departure_city}->${newTicket.booking.trip.arrival_city}`,
            dt: newTicket.booking.trip.departure_time,
            exp: newTicket.expiration_date
          };
          newTicket.qr_code = await QRCode.toDataURL(JSON.stringify(payload), { errorCorrectionLevel: 'M', margin: 1, width: 240 });
        } catch {}
        localStorage.setItem(`ticket_${bookingId}`, JSON.stringify(newTicket));
        setTicket(newTicket);
      } catch (e) {
        setError('Impossible de charger le ticket. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);
  
  // Téléchargement HTML (fallback sûr, ouvre dans un nouvel onglet)
  const handleDownloadTicket = async (): Promise<void> => {
    if (!ticket) return;
    const trip = ticket.booking.trip;
    const passengers = ticket.booking.passenger_details || [];
    const totalAmount = ticket.booking.total_amount || 0;
    const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Billet ${ticket.ticket_reference}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>body{font-family:Arial,sans-serif;background:#f5f5f5;padding:10px} .ticket{max-width:420px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.15);border:2px dashed #059669} .header{background:#059669;color:#fff;padding:16px;border-radius:6px 6px 0 0;text-align:center} .ref{font-size:12px;opacity:.9;margin-top:4px} .content{padding:16px} .route{text-align:center;margin-bottom:12px;padding:8px;background:#f0fdf4;border-radius:6px} .cities{font-size:16px;font-weight:bold;color:#047857} .info-row{display:flex;justify-content:space-between;margin-bottom:6px;font-size:14px} .label{color:#666} .value{font-weight:600} .passenger{font-size:14px;margin-bottom:3px} .total{text-align:center;font-size:18px;font-weight:bold;color:#059669;margin:12px 0} .qr{display:flex;justify-content:center;margin:10px 0} .footer{background:#f8f9fa;padding:10px;text-align:center;font-size:11px;color:#666;border-radius:0 0 6px 6px}</style>
</head><body>
<div class="ticket">
  <div class="header">
    <div>🚌 CONGOMUV</div>
    <div class="ref">${ticket.ticket_reference}</div>
  </div>
  <div class="content">
    <div class="route">
      <div class="cities">${trip.departure_city} → ${trip.arrival_city}</div>
    </div>
    <div class="info">
      <div class="info-row"><span class="label">Départ:</span><span class="value">${new Date(trip.departure_time).toLocaleString('fr-FR')}</span></div>
      <div class="info-row"><span class="label">Référence:</span><span class="value">${ticket.booking.booking_reference}</span></div>
      <div class="info-row"><span class="label">Passagers:</span><span class="value">${passengers.length}</span></div>
      <div class="info-row"><span class="label">Expire le:</span><span class="value">${new Date(ticket.expiration_date).toLocaleDateString('fr-FR')}</span></div>
    </div>
    <div>
      ${passengers.map((p, i) => `<div class="passenger">${i + 1}. ${p.full_name} (${p.age} ans)</div>`).join('')}
    </div>
    <div class="total">${totalAmount.toLocaleString('fr-FR')} CDF</div>
    <div class="qr">${ticket.qr_code ? `<img src="${ticket.qr_code}" alt="QR Code" style="width:120px;height:120px;border:2px solid #059669;border-radius:6px;"/>` : '<div style="width:120px;height:120px;border:2px solid #ccc;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;">QR indisponible</div>'}</div>
  </div>
  <div class="footer">CongoMuv | Support: +243 123 456 789</div>
</div>
</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billet-congomuv-${ticket.ticket_reference}.html`;
    a.rel = 'noopener';
    a.target = '_blank';
    a.click();
    URL.revokeObjectURL(url);
  };
  

  const handleResendEmail = async (): Promise<void> => {
    if (!ticket) return;
    
    setSendingEmail(true);
    
    try {
      // Simulation d'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTicket({ ...ticket, email_sent: true });
      alert('✅ Email envoyé avec succès!');
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Erreur lors de l\'envoi de l\'email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleResendSMS = async (): Promise<void> => {
    if (!ticket) return;

    setSendingSMS(true);
    try {
      // Simulation d'envoi de SMS
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTicket({ ...ticket, sms_sent: true });
      alert('✅ SMS envoyé avec succès!');
    } catch (error) {
      console.error('Error sending SMS:', error);
      setError('Erreur lors de l\'envoi du SMS');
    } finally {
      setSendingSMS(false);
    }
  };

  // Gestion de l'état de chargement
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span>Chargement du ticket...</span>
          </div>
        </div>
      </div>
    );
  }

  // Gestion de l'absence de ticket
  if (!ticket) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 text-center max-w-md w-full">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
          <p className="text-red-500">{error || 'Impossible de charger les détails du ticket.'}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  // Suppression des déclarations en double des fonctions

  // Rendu principal du composant
  const trip = ticket.booking.trip;
  const passengerDetails = ticket.booking.passenger_details || [];
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Ticket Numérique</h2>
              <p className="text-emerald-100 text-sm">{ticket.ticket_reference || 'N/A'}</p>
            </div>
            <button 
              onClick={onClose} 
              aria-label="Fermer" 
              title="Fermer" 
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div id="ticket-content" className="p-6">
          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 border-4 border-emerald-500 rounded-2xl shadow-lg">
              {ticket.qr_code ? (
                <img src={ticket.qr_code} alt="QR Code" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 bg-slate-100 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* Ticket Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-slate-600">Référence réservation</p>
                <p className="font-bold text-slate-900">{ticket.booking.booking_reference}</p>
              </div>
              <div>
                <p className="text-slate-600">Expire le</p>
                <p className="font-semibold text-red-600">
                  {new Date(ticket.expiration_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mb-4">
              <p className="text-slate-600 text-sm mb-2">Trajet</p>
              <p className="text-lg font-bold text-slate-900">
                {ticket.booking.trip.departure_city} → {ticket.booking.trip.arrival_city}
              </p>
              <p className="text-slate-600 text-sm mt-1">
                {new Date(trip.departure_time).toLocaleString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <p className="text-slate-600 text-sm mb-2">Passagers</p>
              {passengerDetails.map((passenger, index) => (
                <div key={index} className="flex items-center space-x-2 mb-1">
                  <span className="bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-slate-900 font-medium">
                    {passenger.full_name} ({passenger.age} ans)
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total payé</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {ticket.booking.total_amount.toLocaleString()} FC
                </span>
              </div>
            </div>
          </div>

          {/* Send Status */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`border rounded-lg p-3 ${ticket.email_sent ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center space-x-2">
                {ticket.email_sent ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <span className="text-lg text-slate-400">📧</span>
                )}
                <span className="text-sm font-medium text-slate-900">Email</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {ticket.email_sent ? 'Envoyé ✓' : 'Non envoyé'}
              </p>
            </div>

            <div className={`border rounded-lg p-3 ${ticket.sms_sent ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center space-x-2">
                {ticket.sms_sent ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <span className="text-lg text-slate-400">💬</span>
                )}
                <span className="text-sm font-medium text-slate-900">SMS</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {ticket.sms_sent ? 'Envoyé ✓' : 'Non envoyé'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleDownloadTicket()}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              <QrCode className="w-5 h-5" />
              <span>Télécharger</span>
            </button>

            <button
              onClick={() => handleResendEmail()}
              disabled={sendingEmail || ticket.email_sent}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition ${
                sendingEmail || ticket.email_sent
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {sendingEmail ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>{ticket?.email_sent ? 'Email envoyé' : 'Renvoyer par email'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleResendSMS()}
              disabled={sendingSMS || ticket.sms_sent}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition ${
                sendingSMS || ticket.sms_sent
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {sendingSMS ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>{ticket?.sms_sent ? 'SMS envoyé' : 'Envoyer par SMS'}</span>
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ℹ️ <strong>Présentez ce QR Code</strong> au moment de l'embarquement. Le ticket est valable jusqu'à la date d'expiration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
