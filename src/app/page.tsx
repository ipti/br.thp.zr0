import CardProduct from "@/components/card_product/card_product";
import Header from "@/components/header/header";
import http from "@/service/axios";


export default async function Home() {

  const product = await http.get("/product");

  return (
    <div>
      <Header />
      <div className="p-4">
        <div className="grid">
          {product?.data?.map((item, index) => {
            return (
              <div className="col-12 md:col-4" key={index} >
                <CardProduct item={item} />
              </div>
            )
          })}
        </div>
      </div>
    </div>

  );
}
