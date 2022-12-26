const requestBody = (user) => {
    return [
      {
        replaceAllText: {
          replaceText: user.name,
          containsText: {
            text: `{volunteerName}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.surname,
          containsText: {
            text: `{volunteerSurname}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.birthDate,
          containsText: {
            text: `{volunteerBirthDate}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.birthCity,
          containsText: {
            text: `{volunteerNationality}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.email,
          containsText: {
            text: `{volunteerEmail}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.address.street}, ${user.address.zipCode} ${user.address.city}, ${user.address.country}`,
          containsText: {
            text: `{volunteerAddress}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.startDate,
          containsText: {
            text: `{missionStartDate}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.endDate,
          containsText: {
            text: `{missionEndDate}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.supportStructure.name,
          containsText: {
            text: `{supportStructureName}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.supportStructure.address.city,
          containsText: {
            text: `{supportStructureCity}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.supportStructure.address.country,
          containsText: {
            text: `{supportStructureCountry}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.supportStructure.qualityLabelHostNumber,
          containsText: {
            text: `{supportStructureQualityLabel}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.supportStructure.OIDNumber,
          containsText: {
            text: `{supportStructureOIDNumber}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.mission.supportStructure.address.street}, ${user.mission.supportStructure.address.zipCode} ${user.mission.supportStructure.address.city}, ${user.mission.supportStructure.address.country}`,
          containsText: {
            text: `{supportStructureAddress}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.mission.supportStructure.projectReferent.phone}`,
          containsText: {
            text: `{supportStructureNumber}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.mission.hostStructure.projectReferent.phone}`,
          containsText: {
            text: `{hostStructureNumber}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.mission.supportStructure.projectReferent.email}`,
          containsText: {
            text: `{supportStructureEmail}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.mission.hostStructure.projectReferent.email}`,
          containsText: {
            text: `{hostStructureEmail}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.mission.hostStructure.projectReferent.phone}`,
          containsText: {
            text: `{hostStructurePhone}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.mission.supportStructure.projectReferent.name} ${user.mission.supportStructure.projectReferent.surname}`,
          containsText: {
            text: `{supportStructureContact}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.hostStructure.name,
          containsText: {
            text: `{hostStructureName}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.hostStructure.address.city,
          containsText: {
            text: `{hostStructureCity}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.hostStructure.address.country,
          containsText: {
            text: `{hostStructureCountry}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.hostStructure.qualityLabelHostNumber,
          containsText: {
            text: `{hostStructureQualityLabel}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.hostStructure.OIDNumber,
          containsText: {
            text: `{hostStructureOIDNumber}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.mission.hostStructure.address.street}, ${user.mission.hostStructure.address.zipCode} ${user.mission.hostStructure.address.city}, ${user.mission.hostStructure.address.country}`,
          containsText: {
            text: `{hostStructureAddress}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.mission.hostStructure.projectReferent.phone}`,
          containsText: {
            text: `{hoststructureNumber}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.mission.hostStructure.projectReferent.email}`,
          containsText: {
            text: `{hoststructureEmail}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.mission.supportStructure.projectReferent.name} ${user.mission.supportStructure.projectReferent.surname}`,
          containsText: {
            text: `{hostStructureContact}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.missionReferent.name,
          containsText: {
            text: `{missionReferentName}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.mission.missionReferent.surname,
          containsText: {
            text: `{missionReferentSurname}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.CESNumber,
          containsText: {
            text: `{volunteerCESNumber}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.birthCity,
          containsText: {
            text: `{volunteerBirthCity}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.address.street}, ${user.address.zipCode}, ${user.address.city}, ${user.address.country}`,
          containsText: {
            text: `{volunteerBirthCity}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.phone,
          containsText: {
            text: `{volunteerPhone}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.ICNumber,
          containsText: {
            text: `{volunteerICNumber}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: user.ICExpirationDate,
          containsText: {
            text: `{volunteerICExpirationDate}`,
            matchCase: true
          }
        }
      },
      {
        replaceAllText: {
          replaceText: `${user.emergencyContact.name} ${user.emergencyContact.surname}`,
          containsText: {
            text: `{volunteerEmergencyContact}`,
            matchCase: true
          }
        }
      },
    ]
    }
module.exports= {requestBody}