export function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    return new Intl.DateTimeFormat('fr-FR', options).format(date);
}

export function formatDateWithoutTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    return new Intl.DateTimeFormat('fr-FR', options).format(date);
}


export function formatPrice(price: number): string {
    const toTransformPrice = price || 0; // Si price est undefined ou null, on le remplace par 0
    return toTransformPrice.toLocaleString('fr-MG', {
        style: 'decimal', // Utiliser 'decimal' au lieu de 'currency' pour éviter "Ar"
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }) + ' Ar'; // Ajout manuel du texte "Ariary"
}

