
let barangList = JSON.parse(localStorage.getItem("barangList")) || {};
let penjualanList = JSON.parse(localStorage.getItem("penjualanList")) || [];

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

function renderBarang() {
  const tabel = document.getElementById("tabelStok");
  const select = document.getElementById("selectBarang");
  tabel.innerHTML = "";
  select.innerHTML = '<option value="">-- Pilih Barang --</option>';
  for (let nama in barangList) {
    const { stok, harga } = barangList[nama];
    tabel.innerHTML += `<tr><td>${nama}</td><td>${stok}</td><td>${formatRupiah(harga)}</td></tr>`;
    select.innerHTML += `<option value="${nama}">${nama}</option>`;
  }
}

function tambahBarang() {
  const nama = document.getElementById("namaBarang").value.trim();
  const stok = parseInt(document.getElementById("stokBarang").value);
  const harga = parseInt(document.getElementById("hargaJual").value);
  if (nama && stok > 0 && harga > 0) {
    if (barangList[nama]) {
      barangList[nama].stok += stok;
      barangList[nama].harga = harga;
    } else {
      barangList[nama] = { stok, harga };
    }
    localStorage.setItem("barangList", JSON.stringify(barangList));
    renderBarang();
    document.getElementById("notifikasi").innerText = `Barang '${nama}' ditambahkan/diupdate.`;
  } else {
    document.getElementById("notifikasi").innerText = "Isi data dengan benar.";
  }
}

function jualBarang() {
  const nama = document.getElementById("selectBarang").value;
  const jumlah = parseInt(document.getElementById("jumlahJual").value);
  if (!nama || !barangList[nama] || jumlah <= 0 || jumlah > barangList[nama].stok) {
    document.getElementById("notifikasi").innerText = "Penjualan gagal. Cek jumlah dan stok.";
    return;
  }
  const harga = barangList[nama].harga;
  const total = jumlah * harga;
  barangList[nama].stok -= jumlah;
  penjualanList.push({
    tanggal: new Date().toLocaleString("id-ID"),
    nama,
    jumlah,
    harga,
    total
  });
  localStorage.setItem("barangList", JSON.stringify(barangList));
  localStorage.setItem("penjualanList", JSON.stringify(penjualanList));
  renderBarang();
  renderLaporan();
  renderNota(nama, jumlah, harga, total);
  document.getElementById("notifikasi").innerText = `Barang '${nama}' terjual ${jumlah} pcs.`;
}

function renderNota(nama, jumlah, harga, total) {
  const div = document.getElementById("nota");
  div.innerHTML = `
    <p><strong>Tanggal:</strong> ${new Date().toLocaleString("id-ID")}</p>
    <p><strong>Barang:</strong> ${nama}</p>
    <p><strong>Jumlah:</strong> ${jumlah}</p>
    <p><strong>Harga Satuan:</strong> ${formatRupiah(harga)}</p>
    <p><strong>Total:</strong> ${formatRupiah(total)}</p>
  `;
}

function renderLaporan() {
  const tbody = document.getElementById("laporan");
  const totalDiv = document.getElementById("totalOmzet");
  tbody.innerHTML = "";
  let totalOmzet = 0;
  penjualanList.forEach(p => {
    tbody.innerHTML += `<tr>
      <td>${p.tanggal}</td><td>${p.nama}</td><td>${p.jumlah}</td>
      <td>${formatRupiah(p.harga)}</td><td>${formatRupiah(p.total)}</td>
    </tr>`;
    totalOmzet += p.total;
  });
  totalDiv.innerText = "Total Omzet: " + formatRupiah(totalOmzet);
}

function cetakLaporan() {
  window.print();
}

document.getElementById("selectBarang").addEventListener("change", () => {
  const nama = document.getElementById("selectBarang").value;
  const jumlah = parseInt(document.getElementById("jumlahJual").value) || 0;
  if (barangList[nama]) {
    const total = barangList[nama].harga * jumlah;
    document.getElementById("totalHarga").innerText = "Total: " + formatRupiah(total);
  } else {
    document.getElementById("totalHarga").innerText = "";
  }
});

document.getElementById("jumlahJual").addEventListener("input", () => {
  const nama = document.getElementById("selectBarang").value;
  const jumlah = parseInt(document.getElementById("jumlahJual").value) || 0;
  if (barangList[nama]) {
    const total = barangList[nama].harga * jumlah;
    document.getElementById("totalHarga").innerText = "Total: " + formatRupiah(total);
  } else {
    document.getElementById("totalHarga").innerText = "";
  }
});

renderBarang();
renderLaporan();


function resetData() {
  if (confirm("Yakin ingin mereset semua data?")) {
    localStorage.clear();
    location.reload();
  }
}
