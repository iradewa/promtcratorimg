
export enum CharacterType {
  HUMAN = "Manusia",
  ANTHROPOMORPHIC_ANIMAL = "Hewan Antropomorfik",
  ROBOT_CYBORG = "Robot/Cyborg",
  MONSTER_FANTASY = "Monster/Makhluk Fantasi",
  ALIEN = "Alien",
  OTHER = "Lainnya"
}

export interface FormState {
  characterType: CharacterType | string; // Allow string for the initial empty value
  characterName: string;
  faceDetails: string;
  profession: string;
  age: string;
  clothingDetails: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
    