const API_URL = "https://script.google.com/macros/s/AKfycbxCWVh9NyysZ6EpojJMhnMBmvX79YdV1vUI7_xvs-fs46RQ3u3ydxcs1KURW1JIjPOo/exec";


async function request(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      "Unable to connect to the voting server."
    );
  }

  return response.json();
}

export async function verifyStudent(studentNumber) {
  return request({
    action: "verifyStudent",
    studentNumber,
  });
}

export async function submitVote(
  studentNumber,
  projectId
) {
  return request({
    action: "submitVote",
    studentNumber,
    projectId,
  });
}

export async function getResults() {
  return request({
    action: "getResults",
  });
}
export async function verifyAdmin(password) {
  return request({
    action: "adminLogin",
    password,
  });
}

export async function setVotingStatus(isOpen, adminPassword) {
  return request({
    action: "setVotingStatus",
    isOpen,
    adminPassword,
  });
}
