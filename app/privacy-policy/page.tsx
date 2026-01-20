'use client'
import Button from '@/components/Button'
import { Container } from '@/components/Container'
import { useRouter } from 'next/navigation'
import React from 'react'

const PrivacyPolicy = () => {
  const router = useRouter()

  return (
    <Container>
      <div className="flex flex-col justify-start items-start text-left py-20 px-5 relative">
        <p>
          Dengan mengetuk <i>Masuk</i>, Anda telah menyetujui aplikasi ini untuk mengumpulkan data
          sesuai <u className="text-blue">kebijakan privasi</u> kami.
        </p>
        <br />
        <h1 className="font-bold">KOMITMEN PERLINDUNGAN PRIVASI</h1>
        <br />
        <p>
          Aplikasi Indonesia Kaya berkomitmen untuk melindungi privasi setiap penggunanya. Kebijakan
          Privasi Indonesia Kaya berlaku untuk seluruh informasi pribadi yang diterima melalui
          aplikasi ini. Silahkan baca Kebijakan Privasi lebih lanjut untuk mengetahui bagaimana kami
          menjunjung tinggi komitmen akan perlindungan privasi Anda.
        </p>
        <br />
        <h2 className="font-bold">KEBUTUHAN PENGUMPULAN INFORMASI</h2>
        <br />
        <p>
          Beberapa informasi anda merupakan syarat dan kebutuhan untuk menggunakan aplikasi
          Indonesia Kaya guna membantu kami menyediakan, mengoperasikan, dan meningkatkan kualitas
          aplikasi ini.
        </p>
        <br />
        <h2 className="font-bold">-Informasi Pribadi</h2>
        <br />
        <p>
          Kami mengumpulkan informasi khusus mengenai identitas Anda ketika menggunakan aplikasi
          seperti nama asli, provinsi tempat tinggal, kota tempat tinggal, tanggal lahir, dan jenis
          kelamin.
        </p>
        <br />
        <h2 className="font-bold">-Informasi Seluler dan Email</h2>
        <br />
        <p>
          Kami mengumpulkan informasi mengenai teknologi kepemilikan Anda ketika menggunakan
          aplikasi seperti nomor telepon seluler dan alamat email yang Anda gunakan.
        </p>
        <br />
        <h2 className="font-bold">-Informasi Aplikasi Pihak Ketiga</h2>
        <br />
        <p>
          Kami mengumpulkan informasi mengenai aplikasi pihak ketiga ketika menggunakan aplikasi
          dengan akun Google dan Google Play.
        </p>
        <br />
        <h2 className="font-bold">PENGGUNAAN APLIKASI OLEH ANAK DI BAWAH UMUR</h2>
        <br />
        <p>
          Indonesia Kaya menawarkan layanan untuk anak-anak di bawah umur dengan pengawasan orang
          dewasa. Untuk perlindungan privasi anak di bawah umur, kami menghimbau orang tua atau wali
          untuk mengawasi dan bertanggung jawab terhadap setiap aktivitas anak ketika menggunakan
          aplikasi ini.
        </p>
        <br />
        <h2 className="font-bold">PERUBAHAN KEBIJAKAN PRIVASI</h2>
        <br />
        <p>
          Kami sewaktu-waktu dapat mengubah Kebijakan Privasi Kami. Setiap perubahan akan efektif
          ketika kami mengumumkan versi terbaru melalui situs www.indonesiakaya.com. Kami menghimbau
          Anda untuk mengakses situs kami untuk mengetahui perubahan terbaru.
        </p>
        <br />
        <Button text="kembali" onClick={() => router.push('/')}></Button>
      </div>
    </Container>
  )
}

export default PrivacyPolicy
