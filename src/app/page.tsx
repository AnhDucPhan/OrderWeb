import HomePageBackGround from "@/component/componentHomePage/homePageBackGround";
import AboutUs from "@/component/componentHomePage/aboutUsHomePage";
import WhyChooseUs from "@/component/componentHomePage/whyChooseUs";
import Rating from "@/component/componentHomePage/rate";
import ListExpert from "@/component/componentHomePage/listExpert";
import Footer from "@/component/componentHomePage/footer";

export default function Page() {
  return (
    <>
      <HomePageBackGround />
      <AboutUs/>
      <WhyChooseUs/>
      <Rating/>
      <ListExpert/>
      <Footer/>
    </>
  )

}