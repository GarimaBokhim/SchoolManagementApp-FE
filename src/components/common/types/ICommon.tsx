export interface IProvince {
  Id: number;
  provinceNameInNepali: string;
  provinceNameInEnglish: string;
}

export interface IDistrict {
  Id: number;
  districtNameInNepali: string;
  districtNameInEnglish: string;
  provinceId: number;
}
export interface IMunicipality {
  Id: number;
  municipalityNameInNepali: string;
  municipalityNameInEnglish: string;
  DistrictId: number;
}
export interface IVdc {
  Id: number;
  VdcNameInNepali: string;
  VdcNameInEnglish: string;
  DistrictId: number;
}
