# WeatherApp

WeatherApp is a modern weather forecasting application built using Vue 3, TypeScript, and Vite. It leverages the WeatherAPI service to provide current weather information.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

WeatherApp is designed to provide users with real-time weather updates. The application fetches data from WeatherAPI and displays it in a user-friendly interface. With the power of Vue 3 and TypeScript, WeatherApp is both scalable and maintainable.

## Features

- Real-time weather updates
- Detailed weather information
- Responsive design
- Built with modern web technologies

## Installation

To get started with WeatherApp, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/systanon/current-weather.git
   cd weatherapp
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

## Configuration

Before running the application, you need to configure your environment variables. Create a `.env.local` file in the root directory of your project and add the following:

```sh
VITE_APP_API_URL=https://api.weatherapi.com/v1/
VITE_APP_WEATHER_API_KEY=my_test_api_key
```

Replace `my_test_api_key` with your actual WeatherAPI key.

## Usage

To start the development server, run:

```sh
npm run dev
```

This will launch the application and you can view it in your browser at `http://localhost:5173/`.

For a production build, run:

```sh
npm run build
```

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy coding! If you have any questions, feel free to reach out.   