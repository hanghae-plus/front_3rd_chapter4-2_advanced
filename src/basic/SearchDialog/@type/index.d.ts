interface SearchOption {
	query?: string;
	grades: number[];
	days: string[];
	times: number[];
	majors: string[];
	credits?: number;
}

type ChangeSearchOption = (
	field: keyof SearchOption,
	value: SearchOption[typeof field]
) => void;
