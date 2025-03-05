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
                    VITE_API_DOMAIN=http://localhost
                    VITE_PORT=5001
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
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    dir('frontend') {
                        sh '''
                        docker build -t $DOCKER_IMAGE:latest -f Dockerfile .
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push $DOCKER_IMAGE:latest
                        '''
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
