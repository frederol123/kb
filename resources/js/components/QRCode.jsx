export default function QRCode({ id }) {
    const qrUrl = `/api/ankets/${id}/qr`;
    return (
        <div className="inline-block bg-white p-4 rounded-xl border border-gray-200">
            <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
        </div>
    );
}
