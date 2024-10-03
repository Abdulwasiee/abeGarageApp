import React from "react";
import {
  FaPowerOff,
  FaCog,
  FaCar,
  FaTachometerAlt,
  FaPaintBrush,
} from "react-icons/fa"; // Import icons
import workshopRight2 from "../../../../assets/images/workshopRight2.png"; // Import image
import workshopRight3 from "../../../../assets/images/workshopRight3.png"; // Import image
import workshopLeft from "../../../../assets/images/workshopLeft.png"; // Import image
import BottomSections from "../BottomSections/BottomSections";
import styles from "./Home.module.css"; // Import CSS module

function Home() {
  return (
    <div className={styles.topcontainer}>
      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.autoContainer}>
          <div className={styles.row1}>
            {/* Left Column: Images */}
            <div className={styles.colLeft}>
              <div className={styles.imageBox}>
                <img
                  className={styles.image1}
                  src={workshopLeft}
                  alt="Image 1"
                />
                <img src={workshopRight3} alt="Image 2" />
              </div>
              <div className={styles.yearExperience}>
                <strong>24</strong>
                <br /> years <br /> Experience
              </div>
            </div>

            {/* Right Column: Text */}
            <div className={styles.colRight}>
              <div className={styles.secTitle3}>
                <h4>Welcome to Our Workshop</h4>
                <h2>We have 24 years experience</h2>
                <div className={styles.text}>
                  <p>
                    Bring to the table win-win survival strategies to ensure
                    proactive domination. At the end of the day, going forward,
                    a new normal that has evolved from generation X is on the
                    runway heading towards a streamlined cloud solution.
                  </p>
                  <p>
                    Capitalize on low-hanging fruit to identify a ballpark
                    value-added activity to beta test. Override the digital
                    divide with additional clickthroughs from DevOps.
                    Nanotechnology immersion along the information highway will
                    close the loop on focusing.
                  </p>
                </div>
                <div className={styles.linkBtn}>
                  <a href="/aboutus" className={styles.themeBtn}>
                    <span>About Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.autoContainer2}>
          {/* Left Column: Text */}
          <div className={styles.innerContainer2}>
            <h2>Quality Service And Customer Satisfaction !!</h2>
            <p className={styles.text}>
              We utilize the most recent symptomatic gear to ensure your vehicle
              is fixed or adjusted appropriately and in an opportune manner. We
              are an individual from Professional Auto Service, a first class
              execution arrange, where free assistance offices share shared
              objectives of being world-class car administration focuses.
            </p>
          </div>

          {/* Right Column: Image */}
          <div className={styles.tireimage}>
            <img
              style={{ maxHeight: "400px" }}
              src={workshopRight2}
              alt="Quality Service"
              className="img-fluid"
            />
          </div>
        </div>
      </section>

      <BottomSections />
    </div>
  );
}

export default Home;
