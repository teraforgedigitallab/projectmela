import testimonial1 from '/assets/images/testimonial/testi1.jpg';
import testimonial2 from '/assets/images/testimonial/testi2.jpg';
import testimonial3 from '/assets/images/testimonial/testi3.jpg';
import testimonial4 from '/assets/images/testimonial/testi4.jpg';

export const genderOptions = ['Male', 'Female', 'Non Binary'];

export const maleAvatars = [
    "https://firebasestorage.googleapis.com/v0/b/project-mela.appspot.com/o/Avatars%2Favatar-male-1.png?alt=media&token=5812643f-910f-417a-a064-bd2c60f012d0",
    "https://firebasestorage.googleapis.com/v0/b/project-mela.appspot.com/o/Avatars%2Favatar-male-2.png?alt=media&token=15736a34-6315-4ab3-840c-22b3fe8f5fbd",
    "https://firebasestorage.googleapis.com/v0/b/project-mela.appspot.com/o/Avatars%2Favatar-male-3.png?alt=media&token=7db39ae0-e3c0-4751-a067-25f85ee75ff4",
    "https://firebasestorage.googleapis.com/v0/b/project-mela.appspot.com/o/Avatars%2Favatar-male-4.png?alt=media&token=9bac85bb-8d5c-4ce3-958f-2eeb7356eb77",
    "https://firebasestorage.googleapis.com/v0/b/project-mela.appspot.com/o/Avatars%2Favatar-male-5.png?alt=media&token=dabeed83-9971-44de-9d37-42e0fc5360f7"
];

export const femaleAvatars = [
    "https://firebasestorage.googleapis.com/v0/b/project-mela.appspot.com/o/Avatars%2Favatar-female-1.png?alt=media&token=a3a69ed8-b522-473f-a2a2-903b5a6b4b5c",
    "https://firebasestorage.googleapis.com/v0/b/project-mela.appspot.com/o/Avatars%2Favatar-female-2.png?alt=media&token=0905e617-999d-46a1-8e3e-f215dc23c2ad",
    "https://firebasestorage.googleapis.com/v0/b/project-mela.appspot.com/o/Avatars%2Favatar-female-3.png?alt=media&token=d0855090-43bd-40ba-8477-cfb117c5aa4e",
    "https://firebasestorage.googleapis.com/v0/b/project-mela.appspot.com/o/Avatars%2Favatar-female-4.png?alt=media&token=5742d33a-f136-44b2-b8b1-0d0f5841d62a"
];

export const skillOptions = [
    'Agile Methodologies', 'Artificial Intelligence', 'AJAX', 'Algorithm Design', 'AWS', 'Amazon DynamoDB', 'Amazon Redshift', 'Amazon S3',
    'Android Development', 'Angular', 'Ansible', 'API Development', 'App Development', 'ASP.NET', 'Assembly Language', 'Azure',
    'Back-End Development', 'Big Data', 'Blazor', 'Blockchain', 'Bootstrap', 'C', 'C#', 'C++', 'CakePHP', 'Chakra UI', 'Cloud Architecture',
    'Cloud Computing', 'Cloud Infrastructure', 'Clojure', 'CMake', 'Computer Networking', 'Containerization', 'Continuous Deployment',
    'Continuous Integration', 'Cordova', 'CSS', 'Cybersecurity', 'D3.js', 'Data Analysis', 'Data Engineering', 'Data Mining', 'Data Modelling', 'Data Science', 'Deno',
    'Dart', 'Database Design', 'Django', 'Docker', 'Drupal', 'ECMAScript', 'Elasticsearch', 'Electron', 'Elixir', 'Ember.js',
    'Entity Framework', 'Ethereum', 'Express.js', 'F#', 'Firebase', 'Flask', 'Flutter', 'Fortran', 'Front-End Development',
    'Full-Stack Development', 'Game Development', 'Gatsby.js', 'Git', 'GitHub', 'GitLab', 'Go', 'Google Cloud Platform', 'GraphQL',
    'Groovy', 'gRPC', 'Hadoop', 'Haskell', 'HTML', 'IaaS', 'Ionic', 'iOS Development', 'Java', 'JavaScript', 'Jenkins', 'Jest', 'Jira',
    'Joomla', 'jQuery', 'JSON', 'Julia', 'Kotlin', 'Kubernetes', 'Laravel', 'Linux', 'Load Balancing', 'Lua', 'Machine Learning',
    'MariaDB', 'MATLAB', 'Memcached', 'Microservices', 'Mobile App Development', 'MongoDB', 'MVC Architecture', 'MySQL',
    'Natural Language Processing', 'Neural Networks', 'Next.js', 'NGINX', 'Node.js', 'NoSQL', 'NumPy', 'Objective-C', 'OAuth',
    'OpenCV', 'OpenGL', 'OpenStack', 'Oracle', 'PaaS', 'Pandas', 'Perl', 'PHP', 'PostgreSQL', 'Progressive Web Apps', 'Puppet',
    'Python', 'R', 'RabbitMQ', 'React', 'React Native', 'Redis', 'Redux', 'REST APIs', 'Ruby', 'Ruby on Rails', 'Rust', 'SaaS',
    'Sass', 'Scala', 'SCSS', 'SEO', 'Shell Scripting', 'Socket.io', 'Software Architecture', 'Software Development', 'Solidity',
    'Spring Boot', 'SQL', 'SQLite', 'SSL/TLS', 'Svelte', 'Swift', 'Symfony', 'System Design', 'TDD (Test-Driven Development)', 'TensorFlow', 'Tailwind CSS', 'Stripe',
    'Terraform', 'Three.js', 'TypeScript', 'UI/UX Design', 'Unit Testing', 'Unity', 'Unreal Engine', 'Vagrant', 'VB.NET', 'Version Control',
    'Virtualization', 'Visual Basic', 'Vite', 'Vue.js', 'Web Development', 'WebRTC', 'WebSockets', 'Webpack', 'Windows Server', 'WordPress',
    'Xamarin', 'XML', 'YAML', 'Yii', 'Zig', 'Zookeeper', 'Zoom API', 'Zurb Foundation'
];

export const projectRoleTypeData = [
    "Full Scale Project",
    "Short Term Project",
    "Internship",
    "Building MVP",
    "Tasks",
    "Updates / Modifications",
    "Fixing Bugs and Issues",
    "Continuous Work",


]

export const maxLengthChecksforProfile = {
    'FirstName': 50,
    'LastName': 50,
    'Email': 100,
    'Mobile': 20,
    'ResumeLink': 300,
    'GithubLink': 300,
    'LinkedinLink': 300,
    'InstagramLink': 300,
    'Designation': 100,
    'EducationalQualification': 100,
    'EducationalInstitute': 100,
    'AboutMe': 1500,
    'MyExperience': 1500,
    'PastProjects': 1500,
};

export const maxLengthChecksForListjob = {
    'name': 60,
    'email': 60,
    'projectTitle': 200,
    'description': 2000,
    'requirements': 2000,
    'responsibilities': 2000
};

export const SUPER_ADMIN_ID = "5678";