const elements = {
  target: document.querySelector('#target-amount'),
  remainingSpan: document.querySelector('#remaining-span'),
  remaining: document.querySelector('#remaining'),
  progress: document.querySelector('#progress-bar-background'),
}

const target = 1000
elements.target.innerHTML = '£' + target

let totalDonationsPercentage
let currentDonations = 0

const intervalID = setInterval(() => {
  console.log('Inside setInterval')
  if (currentDonations < target) {
    console.log('Inside IF')
    const randomDonation = Math.floor( Math.random() * (target / 10) )
    currentDonations += randomDonation
    totalDonationsPercentage = ( currentDonations * 100 ) / target
    elements.remainingSpan.innerHTML = '£' + (target - currentDonations)
    if (totalDonationsPercentage < 100) {
      elements.progress.style.width = `${totalDonationsPercentage}%`
    } else {
      elements.progress.style.width = '100%'
    }
  } else {
    console.log('Inside clearInterval')
    elements.remainingSpan.innerHTML = null
    elements.remaining.innerHTML = 'You\'ve hit your target. Well done!'
    clearInterval(intervalID)
  }

},300)