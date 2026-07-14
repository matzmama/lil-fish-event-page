import "./Footer.css";


function Footer() {


    return (


        <footer className="site-footer">


            <div className="social-links">


                <a href="#">
                    Facebook
                </a>


                <a href="#">
                    X
                </a>


                <a href="#">
                    LinkedIn
                </a>


            </div>


            <p>
                ©2026 Lil Fish Community Center
            </p>


            <button
                className="back-to-top"
                onClick={() =>
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    })
                }
            >
                ↑
            </button>


        </footer>


    );


}


export default Footer;
