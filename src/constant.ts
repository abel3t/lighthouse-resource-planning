import {
  CarePriority,
  CareType,
  DiscipleshipPriority,
  DiscipleshipProcess,
  DiscipleshipType,
  FriendType
} from './enums';

export const DATE_FORMAT = 'DD/MM/YYYY';
export const NOT_APPLICABLE = 'N/A';

export const CareTypeColor = {
  [CareType.Message]: '#ef4444',
  [CareType.FaceToFace]: '#06b6d4',
  [CareType.Call]: '#fde047',
  [CareType.Visit]: '#6d28d9'
};

export const CareTypeText = {
  [CareType.Message]: 'Message',
  [CareType.FaceToFace]: 'Face to Face',
  [CareType.Call]: 'Call',
  [CareType.Visit]: 'Visit'
};

export const CarePriorityColor = {
  [CarePriority.Warning]: '#ef4444',
  [CarePriority.Normal]: '#fde047',
  [CarePriority.Good]: '##22c55e'
};

export const DiscipleshipPriorityColor = {
  [DiscipleshipPriority.Warning]: '#ef4444',
  [DiscipleshipPriority.Normal]: '#fde047',
  [DiscipleshipPriority.Good]: '##22c55e'
};

export const DiscipleshipTypeColor = {
  [DiscipleshipType.Believe]: '#22c55e',
  [DiscipleshipType.ShareGospel]: '#06b6d4',
  [DiscipleshipType.Disciple]: '#6d28d9'
};

export const DiscipleshipTypeText = {
  [DiscipleshipType.Believe]: 'Believe',
  [DiscipleshipType.ShareGospel]: 'Share the Gospel',
  [DiscipleshipType.Disciple]: 'Disciple'
};

export const DiscipleshipProcessColor = {
  [DiscipleshipProcess.Basic]: '#fcd34d',
  [DiscipleshipProcess.Commitment]: '#22c55e',
  [DiscipleshipProcess.Equipment]: '#06b6d4',
  [DiscipleshipProcess.Empowerment]: '#6d28d9'
};

export const FriendTypeColor = {
  [FriendType.Unbeliever]: '#ef4444',
  [FriendType.Unsure]: '#71717a',
  [FriendType.NewLife]: '#22c55e',
  [FriendType.Friend]: '#06b6d4'
};
