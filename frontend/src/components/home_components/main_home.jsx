import NavbarComponent from "../navbar/navbar";
import FooterComponent from "../footer/footer";
import "bootstrap/dist/css/bootstrap.min.css";

function MainHome() {
  return (
    <div className="container">
      <NavbarComponent />
      <div className="text-center">project home updated</div>
      <FooterComponent />
    </div>
  );
}

export default MainHome;
