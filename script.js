const userInput = document.getElementById("username")
const pwdInput = document.getElementById("password")
const confirmInput = document.getElementById("confirmPassword")

const bar = document.getElementById("strengthBar")
const strengthText = document.getElementById("strengthText")
const policyText = document.getElementById("policyStatus")
const matchText = document.getElementById("matchText")

const ruleLength = document.getElementById("rule-length")
const ruleCase = document.getElementById("rule-case")
const ruleNumber = document.getElementById("rule-number")
const ruleSpecial = document.getElementById("rule-special")
const ruleUsername = document.getElementById("rule-username")
const ruleCommon = document.getElementById("rule-common")

const entropySpan = document.getElementById("entropy")
const crackSpan = document.getElementById("crackTime")
const sug = document.getElementById("suggestions")

const policySelect = document.getElementById("policy")
const toggleBtn = document.getElementById("togglePassword")
const copyBtn = document.getElementById("copyBtn")
const themeToggle = document.getElementById("themeToggle")

const commonList = [
  "password",
  "123456",
  "123456789",
  "qwerty",
  "abc123",
  "111111",
  "123123",
  "iloveyou",
  "admin",
  "welcome",
  "letmein",
  "monkey",
  "dragon",
  "football",
  "sunshine"
]

function analyze()
{
  const user = (userInput.value || "").toLowerCase()
  const pwd = pwdInput.value
  const confirm = confirmInput.value
  const policy = policySelect.value

  updateMatch(pwd, confirm)
  const parts = updateRules(pwd, user)
  const score = getScore(pwd, parts)
  updateMeter(score, pwd.length)
  updatePolicyStatus(pwd, parts, policy)
  updateEntropy(pwd, parts)
  updateSuggestions(pwd, parts)
}

userInput.addEventListener("input", analyze)
pwdInput.addEventListener("input", analyze)
confirmInput.addEventListener("input", analyze)
policySelect.addEventListener("change", analyze)

toggleBtn.addEventListener("click", function ()
{
  if (pwdInput.type === "password")
  {
    pwdInput.type = "text"
    confirmInput.type = "text"
    toggleBtn.textContent = "🙈"
  }
  else
  {
    pwdInput.type = "password"
    confirmInput.type = "password"
    toggleBtn.textContent = "👁"
  }
})

copyBtn.addEventListener("click", function ()
{
  const pwd = pwdInput.value
  if (!pwd)
  {
    alert("Enter a password first.")
    return
  }
  navigator.clipboard.writeText(pwd)
    .then(function ()
    {
      copyBtn.textContent = "✅ Copied"
      setTimeout(function ()
      {
        copyBtn.textContent = "📋 Copy Password"
      }, 1200)
    })
    .catch(function ()
    {
      alert("Copy failed. You can copy manually.")
    })
})

themeToggle.addEventListener("click", function ()
{
  const body = document.body
  if (body.classList.contains("dark"))
  {
    body.classList.remove("dark")
    body.classList.add("light")
    themeToggle.textContent = "☀️ Light"
  }
  else
  {
    body.classList.remove("light")
    body.classList.add("dark")
    themeToggle.textContent = "🌙 Dark"
  }
})

function updateMatch(p, c)
{
  if (!p && !c)
  {
    matchText.textContent = ""
    matchText.style.color = ""
    return
  }
  if (!c)
  {
    matchText.textContent = ""
    return
  }
  if (p === c)
  {
    matchText.textContent = "Passwords match."
    matchText.style.color = "#22c55e"
  }
  else
  {
    matchText.textContent = "Passwords do not match."
    matchText.style.color = "#ef4444"
  }
}

function updateRules(p, user)
{
  const hasLower = /[a-z]/.test(p)
  const hasUpper = /[A-Z]/.test(p)
  const hasNum = /[0-9]/.test(p)
  const hasSpecial = /[^A-Za-z0-9]/.test(p)

  toggleValid(ruleLength, p.length >= 8)
  toggleValid(ruleCase, hasLower && hasUpper)
  toggleValid(ruleNumber, hasNum)
  toggleValid(ruleSpecial, hasSpecial)

  let userInside = false
  if (user && p)
  {
    userInside = p.toLowerCase().includes(user)
  }
  toggleWarn(ruleUsername, !userInside, user ? "Password should not contain your username." : "")

  const lowerPwd = p.toLowerCase()
  const isCommon = commonList.some(function (item)
  {
    return item === lowerPwd
  })
  toggleWarn(ruleCommon, !isCommon, isCommon ? "This is a very common password." : "")

  return {
    hasLower: hasLower,
    hasUpper: hasUpper,
    hasNum: hasNum,
    hasSpecial: hasSpecial,
    userInside: userInside,
    isCommon: isCommon
  }
}

function toggleValid(el, ok)
{
  if (ok)
  {
    el.classList.add("valid")
  }
  else
  {
    el.classList.remove("valid")
  }
  el.classList.remove("warn")
}

function toggleWarn(el, ok, msg)
{
  if (ok)
  {
    el.classList.remove("warn")
    el.classList.add("valid")
  }
  else
  {
    el.classList.remove("valid")
    el.classList.add("warn")
  }
  if (msg)
  {
    el.title = msg
  }
  else
  {
    el.removeAttribute("title")
  }
}

function getScore(p, parts)
{
  if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
  if (p.length >= 12) s++
  if (p.length >= 16) s++
  if (parts.hasLower) s++
  if (parts.hasUpper) s++
  if (parts.hasNum) s++
  if (parts.hasSpecial) s++

  let penalty = 0
  if (parts.userInside) penalty += 1
  if (parts.isCommon) penalty += 2
  if (/(.)\1\1/.test(p)) penalty += 1

  s = s - penalty
  if (s < 0) s = 0
  if (s > 7) s = 7

  return s
}

function updateMeter(score, len)
{
  let label = ""
  let color = "#4b5563"
  let width = (score / 7) * 100

  if (!len)
  {
    label = "Start typing to analyze your password."
    width = 0
  }
  else if (score <= 1)
  {
    label = "Very Weak"
    color = "#ef4444"
  }
  else if (score === 2)
  {
    label = "Weak"
    color = "#f97316"
  }
  else if (score === 3)
  {
    label = "Fair"
    color = "#eab308"
  }
  else if (score === 4 || score === 5)
  {
    label = "Strong"
    color = "#22c55e"
  }
  else
  {
    label = "Very Strong"
    color = "#22c55e"
  }

  bar.style.width = width + "%"
  bar.style.background = color
  strengthText.textContent = label
}

function updatePolicyStatus(p, parts, policy)
{
  if (!p)
  {
    policyText.textContent = ""
    return
  }

  let ok = false
  if (policy === "basic")
  {
    ok = p.length >= 8
  }
  else if (policy === "strong")
  {
    ok = p.length >= 12 && parts.hasLower && parts.hasUpper && parts.hasNum && parts.hasSpecial && !parts.isCommon
  }
  else if (policy === "very-strong")
  {
    ok = p.length >= 14 && parts.hasLower && parts.hasUpper && parts.hasNum && parts.hasSpecial && !parts.isCommon && !parts.userInside
  }

  if (ok)
  {
    policyText.textContent = "✅ Meets selected policy: " + policyLabel(policy)
  }
  else
  {
    policyText.textContent = "⚠️ Does not meet selected policy: " + policyLabel(policy)
  }
}

function policyLabel(p)
{
  if (p === "basic") return "Basic (8+ chars)"
  if (p === "strong") return "Strong (12+ with all character types)"
  return "Very Strong (14+ with high complexity)"
}

function updateEntropy(p, parts)
{
  if (!p)
  {
    entropySpan.textContent = "0"
    crackSpan.textContent = "–"
    return
  }

  let pool = 0
  if (/[a-z]/.test(p)) pool += 26
  if (/[A-Z]/.test(p)) pool += 26
  if (/[0-9]/.test(p)) pool += 10
  if (/[^A-Za-z0-9]/.test(p)) pool += 32

  if (pool === 0) pool = 1

  const bits = Math.round(p.length * (Math.log(pool) / Math.log(2)))
  entropySpan.textContent = String(bits)

  const guesses = Math.pow(2, bits)
  const guessesPerSecond = 1e10
  const seconds = guesses / guessesPerSecond
  crackSpan.textContent = formatTime(seconds)
}

function formatTime(sec)
{
  if (sec < 1) return "less than 1 second"
  if (sec < 60) return Math.round(sec) + " seconds"
  const mins = sec / 60
  if (mins < 60) return Math.round(mins) + " minutes"
  const hours = mins / 60
  if (hours < 24) return Math.round(hours) + " hours"
  const days = hours / 24
  if (days < 365) return Math.round(days) + " days"
  const years = days / 365
  if (years < 1e6) return Math.round(years) + " years"
  return "practically impossible (>" + Math.round(years / 1e6) + " million years)"
}

function updateSuggestions(p, parts)
{
  if (!p)
  {
    sug.textContent = "Use a long password with a mix of uppercase, lowercase, numbers, and special characters."
    return
  }

  const tips = []

  if (p.length < 12) tips.push("Increase the length to at least 12 characters.")
  if (!parts.hasLower) tips.push("Add some lowercase letters.")
  if (!parts.hasUpper) tips.push("Add some uppercase letters.")
  if (!parts.hasNum) tips.push("Include at least one digit.")
  if (!parts.hasSpecial) tips.push("Include at least one special character (e.g. !@#$%^&*).")
  if (/(.)\1\1/.test(p)) tips.push("Avoid repeating the same character many times.")
  if (parts.userInside) tips.push("Do not include your username in the password.")
  if (parts.isCommon) tips.push("Avoid very common passwords; make it unique.")

  if (tips.length === 0)
  {
    sug.textContent = "Great! This password looks strong. Make sure you do not reuse it on other sites."
  }
  else
  {
    sug.textContent = tips.join(" ")
  }
}

// initial
analyze()
