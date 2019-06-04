let audioPlayerObj = {}
audioPlayerObj.$container = document.querySelector('.audioPlayer')
audioPlayerObj.$audio = document.createElement('audio')
audioPlayerObj.$audio.setAttribute('src','https://www.thomaslacroix.fr/sounds/song1.mp3')
audioPlayerObj.$audio.classList.add('song1')
audioPlayerObj.$audio.crossOrigin = 'anonymous'
audioPlayerObj.$container.appendChild(audioPlayerObj.$audio)
audioPlayerObj.$playPause = audioPlayerObj.$container.querySelector('.playPause')
audioPlayerObj.$playPauseImg = audioPlayerObj.$container.querySelector('.playingImg')
audioPlayerObj.$seek = audioPlayerObj.$container.querySelector('.seek')
audioPlayerObj.$fill = audioPlayerObj.$seek.querySelector('.fill')
audioPlayerObj.$imgPlay = audioPlayerObj.$container.querySelector('.playPause > img')
audioPlayerObj.$lastTrack = audioPlayerObj.$container.querySelector('.lastTrack')
audioPlayerObj.$nextTrack = audioPlayerObj.$container.querySelector('.nextTrack')
audioPlayerObj.$volumeBar = document.querySelector('.infoSong .soundBar .soundVolume')
audioPlayerObj.$volume = document.querySelector('.soundIn')
audioPlayerObj.$sound = document.querySelector('.infoSong .soundBar img')
let body = document.querySelector('body')

// to pause and unpause the music with animation
audioPlayerObj.$playPause.addEventListener('click', () =>
{
    if(audioPlayerObj.$audio.paused){
        audioPlayerObj.$audio.play()
        audioPlayerObj.$imgPlay.setAttribute('src','images/pause.png')
        audioPlayerObj.$playPauseImg.classList.add('playing')
    }
    else{
        audioPlayerObj.$audio.pause()
        audioPlayerObj.$imgPlay.setAttribute('src','images/play-button.png')
        audioPlayerObj.$playPauseImg.classList.add('playing')
    }
    setTimeout(function(){audioPlayerObj.$playPauseImg.classList.remove('playing')}, 401)
})

// how to have the fill bar updated when dragged with mouse and when clicked
audioPlayerObj.$seek.addEventListener('mousedown', function(){
    audioPlayerObj.$seek.onmousemove = function(_event) {
        let mouseX = _event.clientX
        let bounding = audioPlayerObj.$seek.getBoundingClientRect()
        let ratio = (mouseX - bounding.left) / bounding.width
        let time = ratio * audioPlayerObj.$audio.duration
        audioPlayerObj.$audio.currentTime = time
        audioPlayerObj.$audio.play()
        audioPlayerObj.$imgPlay.setAttribute('src','images/pause.png')
    }
})
body.addEventListener('mouseup', function(){
    audioPlayerObj.$seek.onmousemove = null
})
audioPlayerObj.$seek.addEventListener('click', function(_event){
    let mouseX = _event.clientX
    let bounding = audioPlayerObj.$seek.getBoundingClientRect()
    let ratio = (mouseX - bounding.left) / bounding.width
    let time = ratio * audioPlayerObj.$audio.duration
    audioPlayerObj.$audio.currentTime = time
    audioPlayerObj.$audio.play()
    audioPlayerObj.$imgPlay.setAttribute('src','images/pause.png')
})
const loop = () =>
{
    window.requestAnimationFrame(loop)
    
    if(!audioPlayerObj.$audio.paused){
        const scale = audioPlayerObj.$audio.currentTime / audioPlayerObj.$audio.duration
        audioPlayerObj.$fill.style.transform = `scaleX(${scale})`
    }
}
loop()

// sound bar gestion
window.addEventListener('load', () => {
    let ratio = 0.4
    audioPlayerObj.$volume.style.transform = `scaleX(${ratio})`
    audioPlayerObj.$audio.volume = ratio
})
audioPlayerObj.$volumeBar.addEventListener('mousedown', () => {
    audioPlayerObj.$volumeBar.onmousemove = function(_event) {
        let mouseX = _event.clientX
        let bounding = audioPlayerObj.$volumeBar.getBoundingClientRect()
        let ratio = (mouseX - bounding.left) / bounding.width
        audioPlayerObj.$volume.style.transform = `scaleX(${ratio})`
        localStorage.setItem('ratio',ratio)
    }
})
body.addEventListener('mouseup', function(){
    audioPlayerObj.$volumeBar.onmousemove = null
})
audioPlayerObj.$volumeBar.addEventListener('click', (_event) => {
    let mouseX = _event.clientX
    let bounding = audioPlayerObj.$volumeBar.getBoundingClientRect()
    let ratio = (mouseX - bounding.left) / bounding.width
    audioPlayerObj.$volume.style.transform = `scaleX(${ratio})`
    localStorage.setItem('ratio',ratio)
})
audioPlayerObj.$sound.addEventListener('click', () => {
    let ratio = localStorage.getItem('ratio')
    if(audioPlayerObj.$audio.volume != 0){
        audioPlayerObj.$audio.volume = 0
    }
    else{
        audioPlayerObj.$audio.volume = ratio
        audioPlayerObj.$volume.style.transform = `scaleX(${ratio})`
    }
})
const soundCheck = () => {
    let ratio = localStorage.getItem('ratio')
    window.requestAnimationFrame(soundCheck)
    if(audioPlayerObj.$audio.volume == 0){
        audioPlayerObj.$sound.src = 'images/soundno.png'
        audioPlayerObj.$volume.style.transform = `scaleX(0)`
    }
    else if(0.5 > ratio > 0){
        audioPlayerObj.$sound.src = 'images/soundmin.png'
        audioPlayerObj.$audio.volume = ratio
    }
    else if(ratio > 0.5){
        audioPlayerObj.$sound.src = 'images/sound.png'
        audioPlayerObj.$audio.volume = ratio
    }

}
soundCheck()

// when song arrives at his end, the song change to a next one
const endTracks = (_tracks) => {
    let $audio = audioPlayerObj.$audio
    let $cover = document.querySelector('.infoSong > img')
    let $title = document.querySelector('.infoSong > .column > p')
    if(audioPlayerObj.$audio.currentTime == audioPlayerObj.$audio.duration && $audio.classList.contains('song1')){
        $audio.classList.remove('song1')
        $audio.classList.add('song2')
        $audio.setAttribute('src', _tracks[1].src)
        $cover.setAttribute('src', _tracks[1].img)
        $title.textContent = _tracks[1].title
        $audio.play()
        $audio.currentTime = 0
        audioPlayerObj.$fill.style.transform = `scaleX(0)`
        audioPlayerObj.$imgPlay.setAttribute('src','images/pause.png')
    }
    else if(audioPlayerObj.$audio.currentTime == audioPlayerObj.$audio.duration && $audio.classList.contains('song2')){
        $audio.classList.remove('song2')
        $audio.classList.add('song3')
        $audio.setAttribute('src', _tracks[2].src)
        $cover.setAttribute('src', _tracks[2].img)
        $title.textContent = _tracks[2].title
        $audio.play()
        $audio.currentTime = 0
        audioPlayerObj.$fill.style.transform = `scaleX(0)`
        audioPlayerObj.$imgPlay.setAttribute('src','images/pause.png')
    }
    else if(audioPlayerObj.$audio.currentTime == audioPlayerObj.$audio.duration && $audio.classList.contains('song3')){
        $audio.classList.remove('song3')
        $audio.classList.add('song1')
        $audio.setAttribute('src', _tracks[0].src)
        $cover.setAttribute('src', _tracks[0].img)
        $title.textContent = _tracks[0].title
        $audio.play()
        $audio.currentTime = 0
        audioPlayerObj.$fill.style.transform = `scaleX(0)`
        audioPlayerObj.$imgPlay.setAttribute('src','images/pause.png')
    }
    
}

// when click on next or last track it changes
const changeTracks = (_tracks) => {
    let $audio = audioPlayerObj.$audio
    let $cover = document.querySelector('.infoSong > img')
    let $title = document.querySelector('.infoSong > .column > p')
    
    audioPlayerObj.$nextTrack.addEventListener('click', () => {
        console.log(audioPlayerObj.$audio.buffered)
        if($audio.classList.contains('song1')){
            $audio.classList.remove('song1')
            $audio.classList.add('song2')
            $audio.setAttribute('src', _tracks[1].src)
            $cover.setAttribute('src', _tracks[1].img)
            $title.textContent = _tracks[1].title
        }
        else if($audio.classList.contains('song2')){
            $audio.classList.remove('song2')
            $audio.classList.add('song3')
            $audio.setAttribute('src', _tracks[2].src)
            $cover.setAttribute('src', _tracks[2].img)
            $title.textContent = _tracks[2].title
        }
        else if($audio.classList.contains('song3')){
            $audio.classList.remove('song3')
            $audio.classList.add('song1')
            $audio.setAttribute('src', _tracks[0].src)
            $cover.setAttribute('src', _tracks[0].img)
            $title.textContent = _tracks[0].title
        }
        $audio.play()
        $audio.currentTime = 0
        audioPlayerObj.$fill.style.transform = `scaleX(0)`
        audioPlayerObj.$imgPlay.setAttribute('src','images/pause.png')
    })

    audioPlayerObj.$lastTrack.addEventListener('click', () => {
        if($audio.classList.contains('song1')){
            $audio.classList.remove('song1')
            $audio.classList.add('song3')
            $audio.setAttribute('src', _tracks[2].src)
            $cover.setAttribute('src', _tracks[2].img)
            $title.textContent = _tracks[2].title
        }
        else if($audio.classList.contains('song2')){
            $audio.classList.remove('song2')
            $audio.classList.add('song1')
            $audio.setAttribute('src', _tracks[0].src)
            $cover.setAttribute('src', _tracks[0].img)
            $title.textContent = _tracks[0].title
        }
        else if($audio.classList.contains('song3')){
            $audio.classList.remove('song3')
            $audio.classList.add('song2')
            $audio.setAttribute('src', _tracks[1].src)
            $cover.setAttribute('src', _tracks[1].img)
            $title.textContent = _tracks[1].title
        }
        $audio.play()
        $audio.currentTime = 0
        audioPlayerObj.$fill.style.transform = `scaleX(0)`
        audioPlayerObj.$imgPlay.setAttribute('src','images/pause.png')
    })
}

// Load sounds json
window
    .fetch('https://raw.githubusercontent.com/RomainKH/json_file/master/songinfo.json')
    .then(_response => _response.json())
    .then(_data =>
    {
        changeTracks(_data)
        const loop = () =>
        {
            window.requestAnimationFrame(loop)
            endTracks(_data)
        }
        loop()
    })
// set up link between audio and analyser and set canvas
window.addEventListener('load', initMp3Player)
function initMp3Player(){
    context = new AudioContext()
    analyser = context.createAnalyser()
    canvas = document.querySelector('canvas')
    ctx = canvas.getContext('2d')

    source = context.createMediaElementSource(audioPlayerObj.$audio)
    source.connect(analyser)
    analyser.connect(context.destination)
    frameLooper()
}

function frameLooper(){
    window.requestAnimationFrame(frameLooper)
    // create an array that has the same size as the analyser frequency
    fbc_array = new Uint8Array(analyser.frequencyBinCount)

    // put the visualisation numbers in an array to stock what the spectrum of sound is like at each moment
    analyser.getByteFrequencyData(fbc_array)
    //clear canvas each time it's loaded so that the bars can move with the sound
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(26, 191, 196, 0.5)'
    bars = 100
    // create multiple canvas bars that are generated by the numbers in the array
    for(var i = 0; i < bars; i++){
        barX = i * 3
        barWidth = 2
        barHeight = fbc_array[i] * -0.45
        ctx.fillRect(barX, canvas.height, barWidth, barHeight)
    }
}