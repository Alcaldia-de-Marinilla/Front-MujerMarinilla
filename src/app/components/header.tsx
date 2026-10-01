import Image from 'next/image'

export function Header() {
  // TODO (branding Marinilla): reemplazar los logos por los de la
  // Alcaldía de Marinilla y la campaña local.
  return (
    <div className="flex items-center pb-4 pt-7">
      <Image
        src="/icons/prefeitura.png"
        alt="Logo de la Alcaldía"
        width={84}
        height={42}
      />
      <div className="mx-4 h-[42px] border-l border-gray-300"></div>
      <Image
        src="/icons/Logo_Campanha_Tem_Saida_pb.svg"
        alt="Logo de la campaña"
        width={84}
        height={42}
      />
    </div>
  )
}
