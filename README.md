# **DevOps Project: CI/CD Pipeline with Jenkins, Docker, and AWS**

## **📌 Project Overview**
This is my first hands-on DevOps project, designed to showcase my practical skills in CI/CD pipeline automation. I built this project to gain real-world experience in DevOps with cloud environments, preparing myself for an internship or an entry-level job in the field. Through this project, I have implemented industry-standard DevOps practices, ensuring seamless development, testing, and deployment of applications in the cloud.
This project demonstrates a **CI/CD pipeline** using **Jenkins, Docker, and AWS** for automating the deployment of a personal portfolio website. The pipeline follows DevOps best practices by integrating **GitHub webhooks, Jenkins build automation, Docker containerization, and cloud deployment on AWS EC2 instances**.

## **📹 Live Demo Video**
🎥 **Watch the full demo here:** [Live Demo](https://1drv.ms/v/c/3359ca0e72f1cfbc/EW9rZbQo-LlCj2ATiUNqxRMBNK6ZS1glG-AK0WAmqS0RQw?e=OOgSbY)

## 🚀 Website Preview
<p align="center"> 
  <kbd>
    <a href="https://shivi-1010.github.io/" target="_blank"><img src="examples/preview.gif">
  </a>
  </kbd>
</p>

## **🚀 Technologies Used**
- **Jenkins** (Continuous Integration and Automation)
- **Docker** (Containerization)
- **Git & GitHub** (Version Control and Webhooks)
- **AWS EC2** (Cloud Hosting with 3 VM Servers)
- **Nginx** (Reverse Proxy for Production)
- **WebSocket for Agent Connectivity**

## **🖥️ Architecture**
The pipeline is deployed across **three AWS EC2 instances**:
1. **Jenkins Server** → Manages the pipeline
2. **Staging Server** → Deploys and tests the website
3. **Production Server** → Hosts the final version of the website

## **🔧 Setup & Installation**
### **1️⃣ Install Jenkins on AWS EC2**
```sh
# Update and upgrade system
sudo apt-get update
sudo apt-get upgrade -y

# Install Java (Required for Jenkins)
sudo apt install openjdk-17-jdk -y

# Add Jenkins repository and install
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install jenkins -y

# Start and enable Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### **2️⃣ Configure Jenkins Agent on Staging & Production Servers**
```sh
# Install Java on each server
sudo apt update
sudo apt install openjdk-17-jdk -y
```
#### **Create Jenkins Agent Service**
```sh
sudo nano /etc/systemd/system/jenkins-agent.service
```
Paste the following content:
```ini
[Unit]
Description=Jenkins Agent
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/jenkins
ExecStart=/usr/bin/java -jar /home/ubuntu/jenkins/agent.jar -url http://<JENKINS_SERVER_IP>:8080/ -secret YOUR_SECRET_KEY -name staging -webSocket -workDir "/home/ubuntu/jenkins"
Restart=always

[Install]
WantedBy=multi-user.target
```
```sh
# Reload and start the agent service
sudo systemctl daemon-reload
sudo systemctl enable jenkins-agent
sudo systemctl start jenkins-agent
```

### **3️⃣ Install Git & Clone Repository on Jenkins Server**
```sh
sudo apt update
sudo apt install git -y
cd ~/website
git clone https://github.com/shivi-1010/shivi-1010.github.io.git .
```

### **4️⃣ Install Docker on Staging & Production Servers**
```sh
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
```

## **⚡ Automating CI/CD Pipeline**
### **1️⃣ Configure GitHub Webhooks for Auto Build**
1. **Go to GitHub Repository** → `Settings` → `Webhooks`
2. **Add Webhook**
   - **Payload URL**: `http://<JENKINS_SERVER_IP>:8080/github-webhook/`
   - **Content type**: `application/x-www-form-urlencoded`
   - **Trigger**: `Just the push event`
   - **Click Add Webhook**

### **2️⃣ Setup Jenkins Jobs**
#### **Git Job (Pulls Code from GitHub)**
- Uses **Git plugin** to pull latest code
- Triggers **Build-Website job**

#### **Build-Website Job (Creates Docker Container)**
```sh
sudo docker rm -f $(sudo docker ps -a -q)
sudo docker build -t website /home/ubuntu/jenkins/workspace/Git-job/
sudo docker run -it -p 82:80 -d website
```

#### **Push to Production Job (Deploys to Live Server)**
```sh
sudo docker rm -f $(sudo docker ps -a -q)
sudo docker build -t portfolio_website /home/ubuntu/jenkins/workspace/Git-job/
sudo docker run -it -p 80:80 -d portfolio_website
```

## **🔍 Testing the Pipeline**
### **1️⃣ Make Changes to Index.html on GitHub**
```sh
cd ~/jenkins/workspace/Git-job
sudo nano index.html
```
### **2️⃣ Push Changes to GitHub**
```sh
git add .
git commit -m "Updated changes"
git push origin main
```
🚀 **Jenkins automatically triggers the pipeline** and deploys the changes!

## **🔗 Accessing the Website**
- **Staging Server:** `http://<STAGING_SERVER_IP>:82/`
- **Production Server:** `http://<PRODUCTION_SERVER_IP>/`

## **📚 References**
This project was inspired and built based on the following learning resources:

- [DevOps Course](https://youtube.com/playlist?list=PLVHgQku8Z935yzEejdZ33ZkO9kQoUEt5k&si=ZL5jo1zCiaungnrL)

# Shivani Varu - Digital Portfolio ⚡️
> A clean, responsive, and well-structured portfolio to showcase my skills, projects, and experiences!

> Live at: [shivi-1010.github.io](https://shivi-1010.github.io)

![GitHub stars](https://img.shields.io/github/stars/shivi-1010/shivi-1010.github.io)
![GitHub forks](https://img.shields.io/github/forks/shivi-1010/shivi-1010.github.io)
[![Website Status](https://img.shields.io/badge/website-up-green)](https://shivi-1010.github.io)
[![LinkedIn](https://img.shields.io/badge/connect-linkedin-blue)](https://www.linkedin.com/in/shivani-varu-1012000/)

## 🎯 Features
✔️ Fully Responsive Design\
✔️ HTML5, CSS3, and Materialize\
✔️ Interactive UI with `Typed.js`\
✔️ Easy to Customize

## 🛠 Installation & Deployment
- Clone this repository and modify `index.html` as per your requirements.
- Modify or add images under the `assets/img/` directory.
- Host your portfolio using [GitHub Pages](https://pages.github.com/):
  - Create a repository named `<your-github-username>.github.io`
  - Push your changes to the `main` branch.
  - Your website will be live at `https://<your-github-username>.github.io`

## 📚 Portfolio Sections
✔️ About Me\
✔️ Experience\
✔️ Projects\
✔️ Skills\
✔️ Education\
✔️ Contact Information\
✔️ Resume

🔗 [View Live Portfolio](https://shivi-1010.github.io)

## 🔧 Tools & Technologies Used
- **Hosting**: GitHub Pages
- **Frontend**: HTML, CSS, JavaScript, Materialize
- **Interactivity**: Typed.js
- **Deployment**: Git
---

## 📚 This project automates the **deployment of a static website** using a **fully integrated CI/CD pipeline**. By using **Jenkins, GitHub, Docker, and AWS**, we ensure smooth **development, testing, and production deployments**.

🔹 **Next Steps:** Implement **Monitoring, Logging, and Infrastructure as Code (IaC) using Terraform** to further improve DevOps workflows.

💬 Connect with me:
📧 Email: [varushivani@gmail.com](mailto:varushivani@gmail.com)  
👨‍💻 GitHub: [shivi-1010](https://github.com/shivi-1010)  
💼 LinkedIn: [Shivani Varu](https://www.linkedin.com/in/shivani-varu-1012000/)  

Made with ❤️ by **Shivani Varu**
