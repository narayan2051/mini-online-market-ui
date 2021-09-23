import { Box, Tooltip } from '@material-ui/core';
import HTTPClient, { API_URL } from "../api/api";
import { AppUtils } from "../utils/appUtils";
import { AGE_UNITS, ICD_CODE_OPTIONS, MAJOR_CLASSIFICATIONS_FOR_BELOW_TWO_MONTH, MAJOR_CLASSIFICATIONS_FOR_ABOVE_TWO_MONTH } from "../utils/constants/forms";
import { ALL_ROLES, CASTE_CODES, GENDER_OPTIONS, PALIKA_TYPES, PROVINCE_DISTRICT_PALIKA_LIST } from "../utils/constants/index";

export const AppMisc = {
  getProvinceName(provinceValue) {
    return provinceValue ? PROVINCE_DISTRICT_PALIKA_LIST.find(obj => obj.value === provinceValue).label : "";
  },
  getDistrictName(districtValue) {
    for (let i = 0; i < PROVINCE_DISTRICT_PALIKA_LIST.length; i++) {
      for (let j = 0; j < PROVINCE_DISTRICT_PALIKA_LIST[i].districts.length; j++) {
        if (PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].value === districtValue) {
          return PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].label;
        }
      }
    }
  },
  // TODO: sandeep - refactor the function to minimize loops.
  getMunicipalityName(municipalityValue) {
    for (let i = 0; i < PROVINCE_DISTRICT_PALIKA_LIST.length; i++) {
      for (let j = 0; j < PROVINCE_DISTRICT_PALIKA_LIST[i].districts.length; j++) {
        for (let k = 0; k < PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].palikas.length; k++) {
          if (PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].palikas[k].value === municipalityValue) {
            return PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].palikas[k].label;
          }
        }
      }
    }
  },
  getMunicipalityValueFromLabel(municipalityName) {
    for (let i = 0; i < PROVINCE_DISTRICT_PALIKA_LIST.length; i++) {
      for (let j = 0; j < PROVINCE_DISTRICT_PALIKA_LIST[i].districts.length; j++) {
        for (let k = 0; k < PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].palikas.length; k++) {
          if (PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].palikas[k].label === municipalityName) {
            return PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].palikas[k].value;
          }
        }
      }
    }
  },
  getPalikaTypeName(palikaTypeValue) {
    return palikaTypeValue ? PALIKA_TYPES.find(obj => obj.value === palikaTypeValue).label : "";
  },
  getMunicipalityInfo(municipalityValue) {
    for (let i = 0; i < PROVINCE_DISTRICT_PALIKA_LIST.length; i++) {
      for (let j = 0; j < PROVINCE_DISTRICT_PALIKA_LIST[i].districts.length; j++) {
        for (let k = 0; k < PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].palikas.length; k++) {
          if (PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].palikas[k].value === municipalityValue) {
            return {
              municipalityName: PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].palikas[k].label,
              District: PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].label,
              Province: PROVINCE_DISTRICT_PALIKA_LIST[i].label,
            }
          }
        }
      }
    }
  },
  getUserRole(userRoleValue) {
    return userRoleValue ? ALL_ROLES.find(obj => obj.value === userRoleValue).label : "";
  },

  getAllDartaaNumberOptions(showPatientName) {
    var mulDartaaOptions = [];
    HTTPClient.get(API_URL.mulDartaaRegister + "/mul-dartaa-numbers")
      .then(response => {
        var data = response.data;
        data.forEach(item => {
          let label = item.dartaaNumber;
          if (showPatientName)
            label += " (" + item.patientFirstName + " " + item.patientLastName + ")";
          mulDartaaOptions.push({ "value": item.dartaaNumber, "label": label });
        });
      })
    return mulDartaaOptions;
  },

  getDistrictOptions() {
    let districts = [];
    for (let i = 0; i < PROVINCE_DISTRICT_PALIKA_LIST.length; i++) {
      for (let j = 0; j < PROVINCE_DISTRICT_PALIKA_LIST[i].districts.length; j++) {
        districts.push(PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j]);
      }
    }
    return districts;
  },

  getPALIKA_TYPESByDistrict(district) {
    for (let i = 0; i < PROVINCE_DISTRICT_PALIKA_LIST.length; i++) {
      for (let j = 0; j < PROVINCE_DISTRICT_PALIKA_LIST[i].districts.length; j++) {
        if (PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].value === district) {
          return PROVINCE_DISTRICT_PALIKA_LIST[i].districts[j].palikas;
        }
      }
    }
  },
  getFiscalYearLabel(fiscalYear) {
    return AppUtils.replaceWithNepaliDigit(fiscalYear.replace("_", "/"))
  },
  getIcdCodeObject(icdCode) {
    for (let i = 0; i < ICD_CODE_OPTIONS.length; i++) {
      for (let j = 0; j < ICD_CODE_OPTIONS[i].options.length; j++) {
        if (ICD_CODE_OPTIONS[i].options[j].value === icdCode) {
          return ICD_CODE_OPTIONS[i].options[j];
        }
      }
    }
    return "";
  },
  getMajorClassificationOptions(classifications) {
    let classificationOptions = [];
    for (let i = 0; i < classifications.length; i++) {
      for (let j = 0; j < MAJOR_CLASSIFICATIONS_FOR_BELOW_TWO_MONTH.length; j++) {
        for (let k = 0; k < MAJOR_CLASSIFICATIONS_FOR_BELOW_TWO_MONTH[j].options.length; k++) {
          if (MAJOR_CLASSIFICATIONS_FOR_BELOW_TWO_MONTH[j].options[k].value === classifications[i]) {
            classificationOptions.push(MAJOR_CLASSIFICATIONS_FOR_BELOW_TWO_MONTH[j].options[k])
          }
        }
      }
    }
    return classificationOptions;
  },
  getMajorClassificationOptionsForTwoMonthsAbove(classifications) {
    let classificationOptions = [];
    for (let i = 0; i < classifications.length; i++) {
      for (let j = 0; j < MAJOR_CLASSIFICATIONS_FOR_ABOVE_TWO_MONTH.length; j++) {
        for (let k = 0; k < MAJOR_CLASSIFICATIONS_FOR_ABOVE_TWO_MONTH[j].options.length; k++) {
          if (MAJOR_CLASSIFICATIONS_FOR_ABOVE_TWO_MONTH[j].options[k].value === classifications[i]) {
            classificationOptions.push(MAJOR_CLASSIFICATIONS_FOR_ABOVE_TWO_MONTH[j].options[k])
          }
        }
      }
    }
    return classificationOptions;
  },
  getAgeUnitLabel(ageUnit) {
    return ageUnit ? AGE_UNITS.find(obj => obj.value === ageUnit).label : "";
  },
  getGenderLabel(gender) {
    return gender ? GENDER_OPTIONS.find(obj => obj.value === gender).label : "-";
  },
  getCasteCodeLabelWithTooltip(code) {
    return (
      <Tooltip title={CASTE_CODES.find(obj => obj.value === code).label} placement="top" arrow>
        <Box>{code}</Box>
      </Tooltip>
    );
  }
};
