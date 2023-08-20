updateGitlabCommitStatus state: 'pending'
pipeline {
    // Makes our pipeline run on any node
    // agent any
    agent {
        label 'master'
    }
    options {
        gitLabConnection('gitlab')
    }
    environment {
        GOOGLE_APPLICATION_CREDENTIALS = '/root/key.json'
        KUBECONFIG = '/root/.kube/kubeconfig.yaml'
        CI = 'true'
    }
    
    stages  {
        stage('Build') {
            steps {
                script {
                    try {
                        sh 'npm install'
                        sh 'npm run build'
                        updateGitlabCommitStatus name: 'Build', state: 'success'
                    } catch (exec) {
                        updateGitlabCommitStatus name: 'Build', state: 'failed'
                        throw exec
                    }
                }
            }
        }
        stage('test') {
            when {
                expression {
                    return env.GIT_BRANCH != 'origin/master'
                }
            }
            steps {
                script {
                    try {
                        sh 'npm install'
                        sh 'npm run test'
                        updateGitlabCommitStatus name: 'Test', state: 'success'
                    } catch (exec) {
                        updateGitlabCommitStatus name: 'Test', state: 'failed'
                        throw exec
                    }
                }
            }
        }
        stage('sonar & QA') {
            when {
                expression {
                    return env.GIT_BRANCH != 'origin/master'
                }
            }
            steps {
                script {
                    try {
                        sh 'npm install sonar-scanner'

                        withSonarQubeEnv('Sonar_GCP'){
                            sh 'npm run sonar'
                        }

                        timeout(time: 5, unit: 'MINUTES') {
                            // sleep is only a temporary fix to a bug
                            sleep(10)
                            waitForQualityGate abortPipeline: true
                        }                        
                    } catch (exec) {
                        updateGitlabCommitStatus name: 'sonar', state: 'failed'
                        throw exec
                    }
                    updateGitlabCommitStatus name: 'sonar', state: 'success'
                }

            }
        }


        stage("build-image") {
            when {
                expression {
                    return env.GIT_BRANCH == 'origin/master'
                }
            }
            steps {
                sh 'docker build . -t enablementprojects/shark-ui:latest'
            }
        }
        stage("push-image") {
            when {
                expression {
                    return env.GIT_BRANCH == 'origin/master'
                }
            }
            steps {
                sh 'docker push enablementprojects/shark-ui'
            }
        }
        stage("deploy-image") {
            when {
                expression {
                    return env.GIT_BRANCH == 'origin/master'
                }
            }
            steps {
                sh 'kubectl rollout restart deployment/shark-ui --namespace=shark'
            }
         }
    }
    post {
        always {
            // Cleans the workspace - so Jenkins will run fast and efficiently
            cleanWs()
        }
        success {
            updateGitlabCommitStatus state: 'success'
        }
        failure {
            updateGitlabCommitStatus state: 'failed'
        }
    }
}
