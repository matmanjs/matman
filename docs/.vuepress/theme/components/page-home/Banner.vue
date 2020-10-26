<template>
  <div class="banner">
    <div class="container">
      <img class="logo" src="../../images/logo.png">
      <h1 class="title">matman.js</h1>
      <p class="subtitle">Web 端对端测试（E2E/UI Testing）框架 by JavaScript</p>
      <div class="get-started">
        <a class="button" href="./docs/getting-started">快速开始 →</a>
      </div>
      <ul class="github">
        <li class="star">
          <div class="button star--button">
            <i class="icon star--icon"></i>
            <a href="https://github.com/matmanjs/matman" target="_blank">Star</a>
          </div>
        </li>
        <li class="fork">
          <div class="button fork--button">
            <i class="icon fork--icon"></i>
            <a href="https://github.com/matmanjs/matman" target="_blank">Fork</a>
          </div>
        </li>
        <li class="issue">
          <div class="button issue--button">
            <i class="icon issue--icon"></i>
            <a href="https://github.com/matmanjs/matman/issues" target="_blank">Issues</a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {};
</script>

<style lang="less" scoped>
@import '../../styles/icon.less';
@import '../../styles/content.less';


.banner {
  align-items: center;
  display: flex;
  padding: 2.5rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  background-color: #303846;
  color: #444950;
}

.logo {
  margin-bottom: 1rem !important;
  margin-top: 1rem !important;
  max-width: 170px;
  max-height: 170px;
}

.title {
  color: #fff;
  font-size: 3rem;
}

.subtitle {
  color: #fff;
  font-size: 1.5rem;
}

.get-started {
  display: flex;
  align-items: center;
  justify-content: center;

  .button {
    width: 160px;
    padding: 0.5rem 0;
    border: 1px solid  #1da57a;
    border-radius: .4rem;

    cursor: pointer;
    font-size: 1.35rem;
    font-weight: 600;
    line-height: 1.5;
    text-align: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
    color: #1da57a;
    outline: 0;
    text-decoration: none;

    &:hover {
      color: #fff;
      background-color: #1da57a;
    }
  }
}

.github {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  letter-spacing: 0;
  color: #000000;
  padding: 0 20px;

  & > li {
    display: flex;
    height: 30px;

    &:not(:first-child) {
      margin-left: 18px;
    }
  }

  .button,
  .count {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border-radius: 4px;
    border: solid 1px #e2e2e2;
    background-color: #ffffff;

    a {
      color: #000000;
    }
  }

  .button {
    width: 75px;
  }

  .icon {
    display: block;
    height: 16px;
    margin-right: 6px;
    background-size: 100% 100%;
  }

  .star--icon {
    width: 16px;
    background-image: url(@star);
  }

  .fork--icon {
    width: 12px;
    background-image: url(@fork);
  }

  .issue--icon {
    width: 16px;
    height: 16px;
    background-image: url('../../images/issue.png');
  }

  .count {
    position: relative;
    width: 63px;
    margin-left: 7px;

    &::before {
      content: '';
      position: absolute;
      width: 7.071px;
      height: 7.071px;
      border-left: solid 1px #e2e2e2;
      border-bottom: solid 1px #e2e2e2;
      top: 50%;
      left: 0;
      transform: translate(-50%, -50%) rotate(45deg);
      background-color: #ffffff;
    }
  }
}

</style>
