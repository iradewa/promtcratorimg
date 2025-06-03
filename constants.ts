
import { FormState, CharacterType, SelectOption } from './types';

export const CHARACTER_TYPES: SelectOption[] = [
  { value: "", label: "-- Pilih Tipe Karakter --" },
  { value: CharacterType.HUMAN, label: "Manusia (Human)" },
  { value: CharacterType.ANTHROPOMORPHIC_ANIMAL, label: "Hewan Antropomorfik (Anthropomorphic Animal)" },
  { value: CharacterType.ROBOT_CYBORG, label: "Robot/Cyborg" },
  { value: CharacterType.MONSTER_FANTASY, label: "Monster/Makhluk Fantasi (Monster/Fantasy Creature)" },
  { value: CharacterType.ALIEN, label: "Alien" },
  { value: CharacterType.OTHER, label: "Lainnya (Other)" },
];

export const INITIAL_FORM_STATE: FormState = {
  characterType: "",
  characterName: '',
  faceDetails: '',
  profession: '',
  age: '',
  clothingDetails: '',
};
    