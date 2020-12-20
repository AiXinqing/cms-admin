<template>
  <div>
    <Table
      :columns="$options.hotHeaders"
      :data="hotList"
    >
      <template slot="type" slot-scope="{ row }">
        {{ _findType(row.itemType).label }}
      </template>
    </Table>
  </div>
</template>

<script>
import axios from '@/libs/api.request'

export default {
  hotHeaders: [
    {
      key: 'id',
      title: '热点id'
    },
    {
      key: 'itemType',
      title: '类型',
      slot: 'type'
    },
    {
      key: 'itemId',
      title: '原资源id'
    }
  ],

  data () {
    return {
      hotList: [],
      tabTypes: this.$config.tabTypes
    }
  },

  mounted () {
    this.fetchHots()
  },

  methods: {
    fetchHots () {
      return axios.request({
        url: '/admin/hot/list',
        method: 'get'
      }).then(({ data }) => {
        this.hotList = data.data
      })
    },

    _findType (type) {
      return this.tabTypes.find(item => item.value === type) || {}
    }
  }
}
</script>
