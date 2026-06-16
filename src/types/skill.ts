export interface Skill {
  name: string;
  level: string;
}

export interface SkillCategory {
  title: string;
  iconName: string;
  skills: Skill[];
}

export interface SkillsData {
  categories: SkillCategory[];
}
