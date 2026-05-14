import Image from 'next/image'
import applyImage from '../../assets/apply.png'

export default function Apply() {
  return (
    <div style={{ width: "100%" }}>
      <Image src={applyImage} alt="Apply" style={{ width: "100%", height: "auto", display: "block" }} />
    </div>
  )
}