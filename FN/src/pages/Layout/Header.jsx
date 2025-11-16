import '../../css/Layout/Header.scss'

const Header = () => {

  return (
    <header>
      <div className="header_wrap">
        <button type="button" style={{ cursor: 'pointer' }}>
          <img src="./images/icon_창닫기.png" alt="창닫기" />
        </button>
      </div>
    </header>
  )
}
export default Header