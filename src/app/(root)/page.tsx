import HomePageBackGround from "@/components/componentsRoot/componentHomePage/homePageBackGround";
import AboutUs from "@/components/componentsRoot/componentHomePage/aboutUsHomePage";
import WhyChooseUs from "@/components/componentsRoot/componentHomePage/whyChooseUs";
import Rating from "@/components/componentsRoot/componentHomePage/rate";
import ListExpert from "@/components/componentsRoot/componentHomePage/listExpert";
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// 1. Thêm chữ async vào trước function
export default async function Page() {
  await delay(2000);
  return (
    <>
      <HomePageBackGround />
      <AboutUs />
      <WhyChooseUs />
      <Rating />
      <ListExpert />
    </>
  )
}