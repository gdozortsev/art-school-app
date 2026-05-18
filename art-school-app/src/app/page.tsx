import Image from 'next/image'
import Link from 'next/link'
import landing from '../assets/landing.png'

export default function Landing() {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Image src={landing} alt="Landing" style={{ width: "100%", height: "auto", display: "block" }} />

      {/* Map button - centered */}
      <Link href="/map" style={{
        position: "absolute",
        top: "52%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "25%",
        height: "22%",
        borderRadius: "999px",
        display: "block",
      }} />

      {/* List of schools */}
      <Link href="/all" style={{
        position: "absolute",
        top: "80%",
        left: "27%",
        transform: "translate(-50%, -50%)",
        width: "18%",
        height: "16%",
        borderRadius: "999px",
        display: "block",
      }} />

      {/* Steps and tips */}
      <Link href="/apply" style={{
        position: "absolute",
        top: "80%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "18%",
        height: "16%",
        borderRadius: "999px",
        display: "block",
      }} />

      {/* Careers in the arts */}
      <Link href="/careers" style={{
        position: "absolute",
        top: "80%",
        left: "73%",
        transform: "translate(-50%, -50%)",
        width: "18%",
        height: "16%",
        borderRadius: "999px",
        display: "block",
      }} />
    </div>
  )
}