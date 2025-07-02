"use client";

import { useFetchrequestProductOne } from "@/app/seller/product/one/service/query";
import {
    ProductImage,
    ProductOne,
} from "@/app/seller/product/one/service/type";
import { ZButton } from "@/components/button/button";
import ZDropdown from "@/components/dropdown/dropdown";
import ZInputMask from "@/components/input_mask/input_mask";
import { useCartStore } from "@/service/store/cart_store";
import { Form, Formik } from "formik";
import { useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Rating } from "primereact/rating";
import { useEffect, useState } from "react";
import { ProductClientController } from "../service/controller";

export default function ProductView() {
  const [image, setImage] = useState<ProductImage | undefined>();
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const productClientController = ProductClientController();

  const handleShippingCalculate = (
    cep: string,
    quantity: number,
    idProduct: number
  ) => {
    productClientController.ShippingCalculateAction({
      destinationZipCode: cep.replace(/[^a-zA-Z0-9 ]/g, ""),
      orderItems: [
        {
          productId: idProduct,
          quantity: quantity,
        },
      ],
    });
  };

  const idProductParam = searchParams.get("product");
  const { data: productOneRequest } = useFetchrequestProductOne(
    idProductParam!
  );

  const productOne: ProductOne | undefined = productOneRequest;

  useEffect(() => {
    if (productOneRequest && loading) {
      setImage(productOneRequest.product_image[0]);
      setLoading(false);
    }
  }, [productOneRequest, loading]);

  return (
    
    <div className="p-4 flex flex-row justify-content-center">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left - Product Image */}
        <Card>
          <div className="border-round border-1 surface-border p-4 flex align-items-center justify-content-center">
            <img
              src={image?.img_url ?? "/fallback.jpg"} // Evita erro se `img_url` for undefined
              alt="Yellow Casual Sweater"
              width={350}
              height={350}
              className="w-full max-w-20rem"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-3 justify-content-center">
            {productOne?.product_image?.map((item, i) => (
              <div
                key={i}
                className={`border-2  border-${
                  item.id === image?.id ? "pink-500" : "transparent"
                } border-round p-1 cursor-pointer`}
                onClick={() => setImage(item)}
              >
                <img
                  src={item.img_url}
                  alt="Thumbnail"
                  width={60}
                  height={60}
                  className="border-round"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Right - Product Info */}
        <div className="flex flex-column gap-4">
          <div>
            <h2 className="text-2xl font-bold">{productOne?.name}</h2>
            <div className="flex align-items-center gap-2 mt-2">
              <Rating value={4} readOnly cancel={false} />
              <span className="text-sm text-gray-600">(0)</span>
            </div>
          </div>

          {/* Price and Availability */}
          <div>
            <div className="text-3xl text-pink-500 font-bold mb-1">
              R${productOne?.price}
            </div>
            <div className="text-green-600">Stock Available</div>
          </div>

          <Formik
            initialValues={{ cep: "", quantity: 1 }}
            onSubmit={(values) => {
              handleShippingCalculate(
                values.cep,
                values.quantity,
                parseInt(idProductParam ?? "")
              );
            }}
          >
            {({ values, handleChange }) => {
              return (
                <Form>
                  <div>
                    <label>Quantidade</label>
                    <div className="p-2" />
                    <ZDropdown
                      value={values.quantity}
                      name="quantity"
                      onChange={handleChange}
                      options={[1, 2, 3, 4, 5, 6, 7, 89]}
                    />
                  </div>
                  <div className="p-2" />
                  <div className="flex flex-row gap-2">
                    <ZInputMask
                      mask="99999-999"
                      value={values.cep}
                      name="cep"
                      onChange={handleChange}
                      placeholder="Digite o seu CEP"
                    />
                    <ZButton label="Ok" />
                  </div>
                </Form>
              );
            }}
          </Formik>
          {/* Add to Cart */}
          <Button
            label="Adicionar ao carrinho"
            icon="pi pi-shopping-cart"
            className="p-button-danger w-max"
            onClick={() =>
              useCartStore.getState().addItem({
                id: productOne?.id.toString() ?? "2",
                name: productOne?.name ?? "",
                price: productOne?.price ?? 1,
                quantity: 1,
                image: productOne?.product_image![0]?.img_url ?? "",
              })
            }
          />

          <p className="text-sm text-gray-600">
            Sold By: <strong>Word Wide Wishes</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
