'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useFetchrequestProductOne } from '@/app/seller/product/one/service/query';
import { useSearchParams } from 'next/navigation';
import { ProductImage, ProductOne } from '@/app/seller/product/one/service/type';
import ZInputMask from '@/components/input_mask/input_mask';
import { ZButton } from '@/components/button/button';

const options = ['option 1', 'option 2', 'option 3', 'option 4'];
const types = ['type 1', 'type 2', 'type 3'];

export default function ProductView() {
    const [image, setImage] = useState<ProductImage | undefined>()
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams();

    const idProductParam = searchParams.get("product");
    const { data: productOneRequest } = useFetchrequestProductOne(idProductParam!)

    var productOne: ProductOne | undefined = productOneRequest;

    useEffect(() => {
      if(productOneRequest && loading){
        setImage(productOneRequest.product_image[0])
        setLoading(false)
      }
    }, [productOneRequest, loading])
    


    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [selectedType, setSelectedType] = useState(types[0]);

    return (
        <div className="p-4 flex flex-row justify-content-center">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Left - Product Image */}
                <Card>
                    <div className="border-round border-1 surface-border p-4 flex align-items-center justify-content-center">
                        <img
                            src={image?.img_url}
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
                                className={`border-2  border-${item.id === image?.id ? 'pink-500' : 'transparent'} border-round p-1 cursor-pointer`}
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

                    {/* Options */}
                    <div>
                        <h4 className="mb-2">Option</h4>
                        <div className="flex flex-wrap gap-2">
                            {options.map((option) => (
                                <Button
                                    key={option}
                                    label={option}
                                    onClick={() => setSelectedOption(option)}
                                    className={selectedOption === option ? 'p-button-sm p-button-outlined p-button-secondary' : 'p-button-sm p-button-outlined'}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Types */}
                    <div>
                        <h4 className="mb-2">Type</h4>
                        <div className="flex flex-wrap gap-2">
                            {types.map((type) => (
                                <Button
                                    key={type}
                                    label={type}
                                    onClick={() => setSelectedType(type)}
                                    className={selectedType === type ? 'p-button-sm p-button-secondary' : 'p-button-sm p-button-outlined'}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Price and Availability */}
                    <div>
                        <div className="text-3xl text-pink-500 font-bold mb-1">R${productOne?.price}</div>
                        <div className="text-green-600">Stock Available</div>
                    </div>


                    <div className='flex flex-row gap-2'>
                            <ZInputMask mask='99999-999' />
                            <ZButton label='Ok' />
                    </div>
                    {/* Add to Cart */}
                    <Button label="Add To Cart" icon="pi pi-shopping-cart" className="p-button-danger w-max" />

                    <p className="text-sm text-gray-600">
                        Sold By: <strong>Word Wide Wishes</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
