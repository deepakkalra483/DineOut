import React from "react";

const NewDesign = () => {
  const doctors = [
    {
      name: "Dr. Esther",
      specialty: "Dentist",
      image: "https://via.placeholder.com/100", // Replace with actual image URL
    },
    {
      name: "Dr. Warren",
      specialty: "Physician",
      image: "https://via.placeholder.com/100", // Replace with actual image URL
    },
    {
      name: "Dr. Jenny Wilson",
      specialty: "Neurologist",
      image: "https://via.placeholder.com/100", // Replace with actual image URL
    }, {
      name: "Dr. Warren",
      specialty: "Physician",
      image: "https://via.placeholder.com/100", // Replace with actual image URL
    },
    {
      name: "Dr. Jenny Wilson",
      specialty: "Neurologist",
      image: "https://via.placeholder.com/100", // Replace with actual image URL
    },
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <img
            src="https://via.placeholder.com/50"
            alt="Profile"
            style={styles.profileImage}
          />
          <div>
            <h2 style={styles.greeting}>Hello, Welcome 👋</h2>
            <h3 style={styles.name}>Savannah Nguyen</h3>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search Doctor..."
          style={styles.searchBar}
        />
      </header>

      {/* Filters */}
      <div style={styles.filters}>
        {["All", "Fever", "Cough", "Nausea","All", "Fever", "Cough", "Nausea"].map((filter) => (
          <button key={filter} style={styles.filterButton}>
            {filter}
          </button>
        ))}
      </div>

      {/* Favourite Doctors Section */}
      <section style={styles.section}>
        <h4 style={styles.sectionTitle}>
          Favourite Doctor <span style={styles.seeAll}>See all</span>
        </h4>
        <div style={styles.doctorList}>
          {doctors.map((doctor, index) => (
            <div key={index} style={styles.doctorCard}>
              <img src={doctor.image} alt={doctor.name} style={styles.image} />
              <div style={styles.doctorDetails}>
                <h5 style={styles.doctorName}>{doctor.name}</h5>
                <p style={styles.doctorSpecialty}>
                  {doctor.specialty}{" "}
                  <button style={styles.addButton}>Add</button>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Doctor Section */}
      <section style={styles.section}>
        <h4 style={styles.sectionTitle}>
          Top Doctor <span style={styles.seeAll}>See all</span>
        </h4>
        <div style={styles.doctorCard}>
          <img
            src={doctors[2].image}
            alt={doctors[2].name}
            style={styles.image}
          />
          <div style={styles.doctorDetails}>
            <h5 style={styles.doctorName}>{doctors[2].name}</h5>
            <p style={styles.doctorSpecialty}>{doctors[2].specialty}</p>
          </div>
        </div>
      </section>

      {/* Bottom Tab */}
      <footer style={styles.bottomTab}>
        <button style={styles.bottomTabIcon}>🏠</button>
      </footer>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f7f7f7",
    minHeight: "100vh",
    position: "relative",
  },
  header: {
    backgroundColor: "#2d6a4f",
    padding: "16px",
    borderRadius: "12px",
    color: "#fff",
    marginBottom: "20px",
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
  },
  profileImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "12px",
  },
  greeting: {
    fontSize: "16px",
    margin: "0 0 4px",
  },
  name: {
    fontSize: "20px",
    margin: 0,
  },
  searchBar: {
    width: "95%",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
  },
  filters: {
    display: "flex",
    justifyContent: "space-around",
    overflow:'auto',
    scrollbarWidth:"none"
  },
  filterButton: {
    padding: "8px 16px",
    backgroundColor: "#e7e7e7",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    margin: "0 5px"
  },
  section: {
    padding: "16px",
  },
  sectionTitle: {
    fontSize: "18px",
    margin: "0 0 16px",
  },
  seeAll: {
    fontSize: "14px",
    color: "#007bff",
    cursor: "pointer",
    float: "right",
  },
  doctorList: {
    display: "flex",
    gap: "16px",
    overflow:'auto'
  },
  doctorCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "12px",
  },
  doctorDetails: {
    textAlign: "left",
  },
  doctorName: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 8px",
  },
  doctorSpecialty: {
    fontSize: "14px",
    color: "#666",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    padding: "4px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  bottomTab: {
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    backgroundColor: "#2d6a4f",
    padding: "12px",
    display: "flex",
    justifyContent: "center",
  },
  bottomTabIcon: {
    fontSize: "24px",
    color: "#fff",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
};

export default NewDesign;
