import Image from 'next/image'
import careerImage from '../../assets/careers.png'

export default function Careers() {
  return (
    <div style={{ width: "100%" }}>
      <Image src={careerImage} alt="Careers" style={{ width: "100%", height: "auto", display: "block" }} />
    </div>
  )
}