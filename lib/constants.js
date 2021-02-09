export const Visualisations = {
  LINE_CHART: 'line-chart',
  WORD_CLOUD_ENABLERS: 'word-cloud',
  WORD_CLOUD_BARRIERS: 'word-cloud-barriers',
};

export const Standards = {
  SAFE: 'Safe Care',
  TIMELY: 'Timely Care',
  INDIVIDUAL: 'Individual Care',
  HEALTHY: 'Staying Healthy',
  DIGNIFIED: 'Dignified Care',
  EFFECTIVE: 'Effective Care',
  STAFF: 'Staff and Resources',
  GOVERNANCE: 'Governance, Leadership and Accountability',
};

export const StandardColors = {
  [Standards.SAFE]: '#2f5596',
  [Standards.TIMELY]: '#1a71c0',
  [Standards.INDIVIDUAL]: '#3bb1ef',
  [Standards.HEALTHY]: '#53b151',
  [Standards.DIGNIFIED]: '#f79733',
  [Standards.EFFECTIVE]: '#7035a2',
  [Standards.STAFF]: '#ec462e',
  [Standards.GOVERNANCE]: '#ffc058',
};

export const Roles = {
  USER_TYPE_ADMIN: 'platform_administrator',
  USER_TYPE_CLINICIAN: 'clinician',
  USER_TYPE_DEPARTMENT: 'department_manager',
  USER_TYPE_HOSPITAL: 'hospital',
  USER_TYPE_HEALTH_BOARD: 'health_board',
  USER_TYPE_UNKNOWN: 'unknown',
};
