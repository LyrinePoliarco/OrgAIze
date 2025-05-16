import React, { useState } from "react";
import './Student.css';

const AcssOrgChart = () => {
  const [expandedCommittee, setExpandedCommittee] = useState(null);
  
  // Organization data from the PDF
  const orgData = {
    executiveCommittee: {
      name: "Executive Committee",
      color: "#4338ca",
      members: [
        { position: "President", name: "Faye Camille Buri" },
        { position: "Vice President (Internal)", name: "Aliyah Aira A. Llana" },
        { position: "Vice President (External)", name: "Julius Albert D. Ortiz" },
        { position: "Secretary", name: "Pia Katleya V. Macalanda" },
        { position: "Asst. Secretary", name: "Ricky Joe V. Sanglay" },
        { position: "Treasurer", name: "Saira Sofia S. De Mesa" },
        { position: "Auditor", name: "Etienne V. Banquil" }
      ]
    },
    academicCommittee: {
      name: "Academic Committee",
      color: "#0891b2",
      members: [
        { position: "Chairman", name: "Bai Sakina B. Abad" },
        { position: "Vice Chairman", name: "Angela R. Militar" },
        { position: "Secretary", name: "Precy S. Baguio" },
        { position: "Member", name: "Felix Luis A. Faustino" },
        { position: "Member", name: "Thezzalia Mae B. Salcedo" },
        { position: "Member", name: "Eunice R. Mabasa" },
        { position: "Member", name: "Herky Dee L. Abarquez" },
        { position: "Member", name: "Jorem Blue Bonador" }
      ]
    },
    documentationCommittee: {
      name: "Documentation Committee",
      color: "#ea580c",
      members: [
        { position: "Chairman", name: "Juliana R. Mancera" },
        { position: "Vice Chairman", name: "Jhan Ellen O. Atole" },
        { position: "Secretary", name: "Janice V. Hernandez" },
        { position: "Member", name: "Alyssa Bernadette M. Tuliao" },
        { position: "Member", name: "Jasmin E. Bautista" },
        { position: "Member", name: "Kim Aeriel V. Fonseca" },
        { position: "Member", name: "Ryan James M. Gopio" },
        { position: "Member", name: "Alain Deiniel S. Montes" },
        { position: "Member", name: "Beatriz Marie A. Bautista" },
        { position: "Member", name: "Djem Andreif F. Reyes" }
      ]
    },
    informationCommittee: {
      name: "Information Committee",
      color: "#0ea5e9",
      members: [
        { position: "Chairman", name: "Thoby Jim R. Ralleta" },
        { position: "Vice Chairman", name: "Shaina Blessy Meir T. Telen" },
        { position: "Secretary", name: "Frinz Hughwie D. Bautista" },
        { position: "Member", name: "Erlyn Queen V. De Leon" },
        { position: "Member", name: "Jhoanna May P. Lacorte" },
        { position: "Member", name: "Venus Ruselle B. Daanoy" },
        { position: "Member", name: "Louise Andrea R. Tatoy" },
        { position: "Member", name: "Lyrine M. Poliarco" },
        { position: "Member", name: "Alexa Jane T. De Lima" },
        { position: "Member", name: "Clark Lawrence T. Ching" },
        { position: "Member", name: "Vinz Eulo A. Solano" },
        { position: "Member", name: "Carl Geneson C. Ola" },
        { position: "Member", name: "Karla Mae M. Ibuig" }
      ]
    },
    sportsCommittee: {
      name: "Sports Committee",
      color: "#16a34a",
      members: [
        { position: "Chairman", name: "Prince Nelson J. Aguinaldo Jr." },
        { position: "Vice Chairman", name: "Edward Angel R. Lorica" },
        { position: "Secretary", name: "John Lian R. Nerecina" },
        { position: "Member", name: "David King S. Roderos" },
        { position: "Member", name: "Jairus Joshua C. Ramos" },
        { position: "Member", name: "Sharon Grace T. Hanga-an" },
        { position: "Member", name: "Claryss Mae P. Pangasian" },
        { position: "Member", name: "Hazel Ann D. Espiso" },
        { position: "Member", name: "Steven Keil P. ABorde" },
        { position: "Member", name: "Rhona Angelica G. Cailao" },
        { position: "Member", name: "Alexza Gayle A. Ignacio" },
        { position: "Member", name: "Matthew Henry L. Young" },
        { position: "Member", name: "Julienne Marga D. Baltazar" }
      ]
    },
    studentRelationsCommittee: {
      name: "Student Relations Committee",
      color: "#9333ea",
      members: [
        { position: "Chairman", name: "Julia T. Rodrigo" },
        { position: "Vice Chairman", name: "Vincent M. Mazo" },
        { position: "Secretary", name: "Samantha Pauline L. Ines" },
        { position: "Member", name: "Chryzle A. Amualla" },
        { position: "Member", name: "Kris Partick Luisse F. Sandoval" },
        { position: "Member", name: "Noriel R. Achero" },
        { position: "Member", name: "Heindrich Himmler A. Macalinao" }
      ]
    },
    valuesInfusionCommittee: {
      name: "Values Infusion Committee",
      color: "#c026d3",
      members: [
        { position: "Chairman", name: "Marianne Dale A. Garcia" },
        { position: "Vice Chairman", name: "Ralph Nikko M. Predas" },
        { position: "Secretary", name: "Leo Gabriel L. Rentazida" }
      ]
    },
    yearbookCommittee: {
      name: "Yearbook Committee",
      color: "#e11d48",
      members: [
        { position: "Chairman", name: "Chryzle A. Amualla" },
        { position: "Vice Chairman", name: "Felix Luis A. Faustino" },
        { position: "Secretary", name: "Karla Mae M. Ibuig" }
      ]
    },
    yearLevelRepresentatives: {
      name: "Year-Level Representatives",
      color: "#f59e0b",
      members: [
        { position: "4th Year Representative", name: "Noriel R. Achero" },
        { position: "3rd Year Representative", name: "" },
        { position: "2nd Year Representative", name: "" },
        { position: "1st Year Representative", name: "Heindrich Himmler A. Macalinao" }
      ]
    }
  };

  const handleCommitteeClick = (committeeKey) => {
    if (expandedCommittee === committeeKey) {
      setExpandedCommittee(null);
    } else {
      setExpandedCommittee(committeeKey);
    }
  };

  const renderOrgMembers = (members) => {
    return members.map((member, index) => (
      <div key={index} className="org-member">
        <div className="member-position">{member.position}</div>
        <div className="member-name">{member.name || "Vacant"}</div>
      </div>
    ));
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <img src="/image/org1.png" alt="background" className="welcome-bg-image" />
        <div className="welcome-content">
          <h1>ACSS Organizational Chart</h1>
          <p>Association of Computer Science Students (ACSS) at New Era University College of Informatics and Computing Studies for Academic Year 2024-2025.</p>
        </div>
        <div className="welcome-graphic">
          <div className="pulse-circle"></div>
          <img src="/image/logo.png" alt="ACSS Logo" className="logo-image" />
        </div>
      </div>

      {/* Main Organization Structure */}
      <div className="section-header">
        <h2>Organization Structure</h2>
        <p>Click on any committee to view its members</p>
      </div>

      <div className="org-chart-container">
        {/* Executive Committee at the top */}
        <div 
          className="org-chart-executive" 
          style={{ 
            '--org-color': orgData.executiveCommittee.color 
          }}
          onClick={() => handleCommitteeClick('executiveCommittee')}
        >
          <h3>{orgData.executiveCommittee.name}</h3>
          {expandedCommittee === 'executiveCommittee' && (
            <div className="committee-members-container">
              {renderOrgMembers(orgData.executiveCommittee.members)}
            </div>
          )}
        </div>

        {/* Connector line from executive to other committees */}
        <div className="org-chart-connector"></div>

        {/* All other committees */}
        <div className="org-chart-committees">
          {Object.keys(orgData).filter(key => key !== 'executiveCommittee').map((committeeKey) => {
            const committee = orgData[committeeKey];
            return (
              <div
                key={committeeKey}
                className={`org-chart-committee ${expandedCommittee === committeeKey ? 'expanded' : ''}`}
                style={{ '--org-color': committee.color }}
                onClick={() => handleCommitteeClick(committeeKey)}
              >
                <h3>{committee.name}</h3>
                {expandedCommittee === committeeKey && (
                  <div className="committee-members-container">
                    {renderOrgMembers(committee.members)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="section-header">
        <h2>About ACSS</h2>
        <p>Learn more about our organization</p>
      </div>

      <div className="about-acss">
        <div className="about-card">
          <h3>Mission</h3>
          <p>To foster academic excellence and professional development among computer science students through various activities, workshops, and events.</p>
        </div>
        <div className="about-card">
          <h3>Vision</h3>
          <p>To be the leading student organization that bridges the gap between academic learning and industry practice in the field of computer science.</p>
        </div>
        <div className="about-card">
          <h3>Core Values</h3>
          <p>Excellence, Integrity, Innovation, Collaboration, and Service.</p>
        </div>
      </div>

      {/* Custom CSS for the Org Chart */}
      <style jsx>{`
        .org-chart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 2rem 0;
          gap: 2rem;
        }

        .org-chart-executive {
          background-color: white;
          border: 2px solid var(--org-color);
          border-radius: 12px;
          padding: 1.5rem;
          width: 100%;
          max-width: 400px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .org-chart-executive:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .org-chart-executive h3 {
          color: var(--org-color);
          margin: 0;
          font-size: 1.5rem;
        }

        .org-chart-connector {
          height: 40px;
          width: 2px;
          background-color: #6b7280;
        }

        .org-chart-committees {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 1.5rem;
          width: 100%;
        }

        .org-chart-committee {
          background-color: white;
          border: 2px solid var(--org-color);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .org-chart-committee:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .org-chart-committee h3 {
          color: var(--org-color);
          margin: 0;
          font-size: 1.2rem;
        }

        .committee-members-container {
          margin-top: 1.5rem;
          max-height: 300px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 0.5rem;
        }

        .org-member {
          display: flex;
          flex-direction: column;
          padding: 0.75rem;
          border-radius: 8px;
          background-color: #f3f4f6;
          transition: all 0.3s ease;
        }

        .org-member:hover {
          background-color: #e5e7eb;
        }

        .member-position {
          font-size: 0.875rem;
          color: var(--org-color);
          font-weight: 600;
        }

        .member-name {
          font-size: 1rem;
          color: #111827;
        }

        .about-acss {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .about-card {
          background-color: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .about-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
        }

        .about-card h3 {
          color: #4338ca;
          margin-bottom: 1rem;
          font-size: 1.3rem;
          position: relative;
          padding-bottom: 0.5rem;
        }

        .about-card h3::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 3px;
          background-color: #4338ca;
        }

        .about-card p {
          color: #4b5563;
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          .org-chart-committees {
            grid-template-columns: 1fr;
          }
          
          .about-acss {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AcssOrgChart;