import Image from "next/image";
import "./about.css";
import about from "../../../assets/img/about.png";
import backgroundVerde from "../../../assets/img/verde_home.png";

export default function About() {
  return (
    <div className="container_about">
      <div className="container_verde" />

      <div className="grid about_text">
        <div className="col-12 md:col-6">
          <h1 className="mb-6 mt-8 ml-8">Sobre</h1>
          <p className="mb-6 mt-8 ml-8">
            Lorem ipsum dolor sit amet. Aut molestiae cupiditate qui corrupti
            reiciendis et deleniti dolores aut quis omnis est eveniet Quis. Aut
            asperiores delectus eum iure quisquam aut fuga cupiditate et
            reprehenderit veritatis? Et laudantium quam vel consequatur galisum
            ut beatae numquam ex voluptatem nemo. Et iste dolorum vel tenetur
            autem et rerum sint qui neque temporibus et galisum suscipit aut
            molestias delectus.{" "}
          </p>
        </div>
        <div className="col-12 md:col-6">
          <div className="flex flex-column justify-content-center align-items-center mt-7 ml-8">
            <Image alt="Sobre" src={about} width={512} height={512} />
          </div>
        </div>
      </div>
    </div>
  );
}
