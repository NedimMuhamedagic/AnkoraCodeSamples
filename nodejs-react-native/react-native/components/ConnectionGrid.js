import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatList, SectionList } from 'react-native'
import { compose } from 'redux'
import { getConnections } from '../actions'
import GridItem from './connection/GridItem'
import { withSpinnerOnLoading, withoutKeyboard, ListViewSectionHeader } from './common'

export class ConnectionGrid extends Component {

  componentWillMount() {
    this.props.getConnections()
  }

  renderGridItem( { item } ) {
    const { navigation } = this.props
    return (
      <GridItem
        connection={ item }
        index={ item.index }
        navigation={ navigation }
      />
    )
  }

  renderList( { item } ) {
    const { getConnections, loading } = this.props

    return (
      <FlatList
        data={ item }
        enableEmptySections
        keyExtractor={ item => item._id }
        numColumns={ 4 }
        onRefresh={ getConnections }
        refreshing={ loading }
        renderItem={ this.renderGridItem.bind( this ) }
      />
    )
  }

  renderSectionHeader = ( sectionData ) => {

    return (
      <ListViewSectionHeader title={ sectionData.section.title } />
    )
  }

  render() {
    const { loading, getConnections } = this.props

    return (
      <SectionList
        keyExtractor={ ( item ) => item._id }
        onRefresh={ getConnections }
        refreshing={ loading }
        renderItem={ this.renderList.bind( this ) }
        renderSectionHeader={ this.renderSectionHeader }
        sections={ this.props.groupedConnections }
      />
    )
  }
}

const mapStateToProps = ( { connectionList } ) => {
  const { loading } = connectionList
  const connections = _.map( connectionList.connections, ( val ) => {
    return { ...val, uid: val._id }
  } )

  return {
    connections: connections,
    loading,
    groupedConnections: connectionList.groupedConnections,
  }
}

const enhance = compose(
  connect( mapStateToProps, { getConnections } ),
  withSpinnerOnLoading(),
  withoutKeyboard()
)

export default enhance( ConnectionGrid )
