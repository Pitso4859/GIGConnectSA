-- V2: Seed job categories
INSERT INTO job_categories (id, name, description, icon_name) VALUES
    (uuid_generate_v4(), 'Plumbing', 'Pipe repairs, installations, and water system work', 'wrench'),
    (uuid_generate_v4(), 'Gardening', 'Lawn care, landscaping, and garden maintenance', 'tree'),
    (uuid_generate_v4(), 'Cleaning', 'Domestic and commercial cleaning services', 'spray-can'),
    (uuid_generate_v4(), 'Electrical', 'Electrical installations and repairs', 'bolt'),
    (uuid_generate_v4(), 'Painting', 'Interior and exterior painting services', 'paint-brush'),
    (uuid_generate_v4(), 'Carpentry', 'Furniture, fixtures, and woodwork', 'hammer'),
    (uuid_generate_v4(), 'Moving', 'Furniture removal and relocation assistance', 'truck'),
    (uuid_generate_v4(), 'Security', 'Security guard and patrol services', 'shield'),
    (uuid_generate_v4(), 'Cooking', 'Private chef and catering services', 'utensils'),
    (uuid_generate_v4(), 'Tutoring', 'Academic tutoring and coaching', 'book');
