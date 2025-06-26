import CardProduct from "@/components/card_product/card_product";
import http from "@/service/axios";


export default async function Home() {

  // const pop = await http.get("/product");

  return (
    <div className="p-4">
      <div className="grid">
        {/* {pop?.data?.map((item, index) => {
          return (
            <div className="col-12 md:col-4" key={index} >
              <CardProduct item={item} />
            </div>
          )
        })} */}

        pagina inicial
      </div>
    </div>

  );
}
