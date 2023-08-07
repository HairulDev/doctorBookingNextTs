export default function convertToRupiah(value) {
    const rupiah = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(value);
    return rupiah.replace(",00", "");
}