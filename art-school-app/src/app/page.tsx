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
        top: "44%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "18%",
        height: "14%",
        borderRadius: "999px",
        display: "block",
      }} />

      {/* List of schools */}
      <Link href="/all" style={{
        position: "absolute",
        top: "72%",
        left: "27%",
        transform: "translate(-50%, -50%)",
        width: "16%",
        height: "14%",
        borderRadius: "999px",
        display: "block",
      }} />

      {/* Steps and tips */}
      <Link href="/apply" style={{
        position: "absolute",
        top: "72%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "16%",
        height: "14%",
        borderRadius: "999px",
        display: "block",
      }} />

      {/* Careers in the arts */}
      <Link href="/careers" style={{
        position: "absolute",
        top: "72%",
        left: "73%",
        transform: "translate(-50%, -50%)",
        width: "16%",
        height: "14%",
        borderRadius: "999px",
        display: "block",
      }} />
    </div>
  )
}