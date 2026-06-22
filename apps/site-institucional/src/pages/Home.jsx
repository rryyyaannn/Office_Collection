import Hero from "../components/Hero";
import FeaturesBar from "../components/FeaturesBar";
import Segments from "../components/Segments";
import Catalog from "../components/Catalog";
import EstudioCriacao from "../components/EstudioCriacao";
import Clientes from "../components/Clientes";
import Blog from "../components/Blog";
import Historia from "../components/Historia";
import Esg from "../components/Esg";
import Diferenciais from "../components/Diferenciais";
import Newsletter from "../components/Newsletter";

export default function Home() {
  return (
    <>
      {/* Funil: impacto → benefícios → produtos → prova social → conteúdo → institucional */}
      <Hero />
      <FeaturesBar />
      <Segments />
      <Catalog />
      <EstudioCriacao />
      <Clientes />
      <Blog />
      <Historia />
      <Esg />
      <Diferenciais />
      <Newsletter />
    </>
  );
}
