import ZCard from '@/components/card/card'
import ZDivider from '@/components/divider/divider'
import { UserGlobal } from '@/service/global_request/type'
import Link from 'next/link'
import '../card_address/card_address.css'

export default function CardPerson({
  item,
  isEdit,
  cep,
  onEditHref = '/profile/your_information'
}: {
  item: UserGlobal
  isEdit?: boolean
  cep?: string
  onEditHref?: string
}) {
  const document = [item.customer.cpf, item.customer.cnpj].filter(Boolean).join(' ')

  return (
    <ZCard className="text-p">
      <div className="card-style">
        <h3>Dados pessoais</h3>
        <p>Informações que serão inseridas na nota fiscal do pedido.</p>
        <dl className="checkout-person-details">
          {item.name ? <div><dt>Nome</dt><dd>{item.name}</dd></div> : null}
          {document ? <div><dt>CPF/CNPJ</dt><dd>{document}</dd></div> : null}
          {item.customer.phone ? <div><dt>Telefone</dt><dd>{item.customer.phone}</dd></div> : null}
          {item.email ? <div><dt>E-mail</dt><dd>{item.email}</dd></div> : null}
          {cep ? <div><dt>CEP</dt><dd>{cep}</dd></div> : null}
        </dl>
      </div>
      {isEdit ? (
        <>
          <ZDivider />
          <div className="card-style checkout-card-action">
            <Link className="flex flex-row gap-2 align-items-center" href={onEditHref}>
              {!item.customer.phone ? <i className="pi pi-exclamation-triangle" aria-hidden="true" /> : null}
              <span>Modificar dados pessoais</span>
            </Link>
          </div>
        </>
      ) : null}
    </ZCard>
  )
}
