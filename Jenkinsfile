pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "gowshik204/airbnb-clone-frontend"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/GOWSHIK-2004/airbnb-clone.git'
            }
        }

        stage('Setup Environment') {
            steps {
                dir('frontend') { // Ensures we are working in frontend folder
                    writeFile file: '.env', text: """
                    VITE_API_DOMAIN=http://172.17.0.4:5001
                    
                    """
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    def nodeHome = tool name: 'nodejs-18', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Project') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

         stage('Docker Build & Push') {
            steps {
                script {
                    def dockerImage = "${DOCKER_IMAGE}:latest"

                    // Build the Docker image
                    sh "docker build -t ${dockerImage} -f frontend/Dockerfile ."

                    // Authenticate and push the image
                    withDockerRegistry([credentialsId: 'docker-hub-credentials', url: '']) {
                        sh "docker push ${dockerImage}"
                    }
                }
            }
        }

    }

    post {
        success {
            echo " Docker Image Built & Pushed Successfully!"
        }
        failure {
            echo " Build or Docker Push Failed!"
        }
    }
}
