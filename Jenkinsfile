pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = "vranjan041/to_do"
        DOCKER_TAG = "latest"
        DOCKER_USERNAME = "vranjan041" 
        DOCKER_PASSWORD = credentials('dockerhub-password') 
    }

    stages {
        stage('Checkout') {
            steps {
            checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'new_git_token', url: 'https://github.com/vranjan041/Task_manager_ci_cd.git']])
            }
        }
        

        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Docker Image') {
                    steps {
                        script {
                            sh """
                            docker build -t ${DOCKER_IMAGE_NAME}-backend:${DOCKER_TAG} -f Dockerfile.backend .
                            """
                        }
                    }
                }
                stage('Build Frontend Docker Image') {
                    steps {
                        script {
                            sh """
                            docker build -t ${DOCKER_IMAGE_NAME}-frontend:${DOCKER_TAG} -f Dockerfile.frontend .
                            """
                        }
                    }
                }
            }
        }

        stage('Login to DockerHub') {
            steps {
                script {
                    sh """
                    echo \${DOCKER_PASSWORD} | docker login -u \${DOCKER_USERNAME} --password-stdin
                    """
                }
            }
        }

        stage('Push Docker Images to DockerHub') {
            steps {
                script {
                    sh "docker push ${DOCKER_IMAGE_NAME}-backend:${DOCKER_TAG}"
                    sh "docker push ${DOCKER_IMAGE_NAME}-frontend:${DOCKER_TAG}"
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                script {
                    sh "echo 'minikube does not work in jenkins'"
                    }
                }
            }
        
    }

    post {
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
