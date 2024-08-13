import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";

const PRODUCT_PER_PAGE = 4;

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const WixClient = await wixClientServer();

  const productQuery = WixClient.products
    .queryProducts()
    .startsWith("name", searchParams?.name || "")
    .hasSome(
      "productType",
      searchParams?.type ? [searchParams.type] : ["physical", "digital"]
    )
    .gt("priceData.price", searchParams?.min || 0)
    .lt("priceData.price", searchParams?.max || 100000)
    .eq("collectionIds", categoryId)
    .limit(limit || PRODUCT_PER_PAGE)
    .skip(
      searchParams?.page
        ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
        : 0
    )
    .find();

  // .find();
  // if (searchParams?.sort) {
  //   const [sortType, sortBy] = searchParams.sort.split(" ");

  //   if (sortType === "asc") {
  //     productQuery.ascending(sortBy);
  //   }

  //   if (sortType === "desc") {
  //     productQuery.descending();
  //   }
  // }
  const res = await productQuery;
  console.log(res);

  return (
    <>
      <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
        {res?.items?.map((product: products.Product) => (
          <Link
            href={"/" + product.slug}
            className="w-full gap-4 flex flex-col sm:w-[45%] lg:w-[22%]"
            key={product._id}
          >
            <div className="relative w-full h-80">
              <Image
                src={product.media?.mainMedia?.image?.url!}
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md "
              />
              {
                "In here we can add an another image tag to show another image when the mouse hover around the image"
              }
            </div>
            <div className="flex justify-between ">
              <span className="font-bold capitalize ">{product.name} </span>
              <span className="font-semibold">₹{product.priceData?.price}</span>
            </div>
            {product.additionalInfoSections && (
              <div
                className="text-gray-500 text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    product.additionalInfoSections?.find(
                      (section: any) => section.title === "shortDesc"
                    )?.description || ""
                  ),
                }}
              />
            )}
            <button className="rounded-2xl ring-1 ring-lama text-lama py-2 px-2 text-xs hover:bg-lama hover:text-white w-max">
              Add to cart
            </button>
          </Link>
        ))}
      </div>
      {searchParams?.cat || searchParams?.name ? (
        <Pagination
          currentPage={res.currentPage || 0}
          hasprev={res.hasPrev()}
          hasNext={res.hasNext()}
        />
      ) : null}
    </>
  );
};

export default ProductList;
