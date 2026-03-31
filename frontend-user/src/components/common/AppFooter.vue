<script setup lang="ts">
// AppFooter - 全局页脚组件
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="brand-text">王者荣耀</span>
          <p class="brand-slogan">5v5 英雄公平对战手游</p>
        </div>
        
        <div class="footer-links">
          <div class="link-group">
            <h4>游戏</h4>
            <router-link to="/heroes">英雄</router-link>
            <router-link to="/equipment">装备</router-link>
          </div>
          <div class="link-group">
            <h4>资讯</h4>
            <router-link to="/events">赛事</router-link>
            <router-link to="/">新闻</router-link>
            <router-link to="/version-hub">版本</router-link>
          </div>
          
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} 王者荣耀. 仅供学习交流使用.</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  background-color: darken($color-bg-dark, 2%);
  border-top: 1px solid $color-border-light;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: $spacing-lg $spacing-md;
}

.footer-content {
  @include flex-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}

.footer-brand {
  .brand-text {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    @include gold-text;
  }

  .brand-slogan {
    color: $color-text-secondary;
    font-size: $font-size-sm;
    margin-top: $spacing-xs;
  }
}

.footer-links {
  display: flex;
  gap: $spacing-xl;
}

.link-group {
  h4 {
    color: $color-text-primary;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    margin-bottom: $spacing-sm;
  }

  a {
    display: block;
    color: $color-text-secondary;
    font-size: $font-size-sm;
    margin-bottom: $spacing-xs;
    transition: color $transition-fast;

    &:hover {
      color: $color-primary;
    }
  }
}

.footer-bottom {
  padding-top: $spacing-md;
  border-top: 1px solid $color-border-light;
  text-align: center;

  p {
    color: $color-text-muted;
    font-size: $font-size-xs;
    margin: 0;
  }
}

// Responsive styles
@include respond-below('md') {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-links {
    justify-content: center;
    gap: $spacing-lg;
  }
}
</style>
