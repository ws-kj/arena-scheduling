var rows = [
	//["6AM to 9:15", "*", "*Planning", "Staff Meeting", "*Planning", "*Planning"],
	["", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
	["9:00 to 9:48", "A", "I", "A", "A", "A"],
	["9:53 to 10:41", "B", "B", "B", "Town Meeting", "B"],
	["10:46 to 11:34", "C", "C", "C", "D", "C"],
	["11:34 to 12:14", "LUNCH", "LUNCH", "LUNCH", "LUNCH", "LUNCH"],
	["12:14 to 1:02", "D", "D", "E", "E", "D"],
	["1:02 to 1:55", "F", "E", "F", "F", "E"],
	["1:55 to 2:09", "I", "TA", "I", "TA", "I"],
	["2:09 to 2:57", "G", "F", "G", "G", "G"],
	["SPORTS BUS"], // .sport
	["3:02 to 3:50", "H", "H", "TA", "H", "H"]
]
var colors = [
	"#FFF3CF", // A
	"#FECB2F",
	/*"#FD28FC",*/ "#ff89fe", // C block
	"#CC9CFD",
	"#76E0FE",
	"#FFCC9C",
	"#9ACB28",
	"#EEECE2", // H
	"#FFFE9F", // Planning, index 8
	"#4FADC5", // TA & TM, index 9
]

class Schedule extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			colors: true,
			rooms: false,
		}
	}
	render() {
		var tickets = this.props.tickets
		tickets.sort(((a, b) => a.block.localeCompare(b.block)))
		return <div>
			<BioChemAlert tickets={tickets} />
			<div className="schedule-cb">
				<div>
					<input id="schedule-cb-colors" type="checkbox" checked={this.state.colors} onChange={() => this.setState(s => {return {...s, colors: !s.colors}})} />
					<label htmlFor="schedule-cb-colors">Colors</label>
				</div>
				<div>
					<input id="schedule-cb-rooms" type="checkbox" checked={this.state.rooms} onChange={() => this.setState(s => {return {...s, rooms: !s.rooms}})} />
					<label htmlFor="schedule-cb-rooms">Display Class Rooms</label>
				</div>
				<a className="button print-button" onClick={() => window.print()}><i className="fa fa-print print-icon" /> Print</a>
				In Chrome, some lines may not appear in the print preview, but they will appear in the final output.
			</div>
			<div className="schedule">
				{rows.map((r, i) => r.map((cell, j) => {
					var bi = (cell == "") ? -1 : "ABCDEFGH".indexOf(cell); // No PM block
					var color = bi >= 0
						? colors[bi]
						: (cell[0] == "*"
							? colors[8]
							: (cell == "TA" || cell == "Town Meeting" ? colors[9] : null))
					var style = (this.state.colors && color) ? { backgroundColor: color } : {};
					var t = bi >= 0 ? tickets.filter(t => t.block == cell)[0] : null;
					var c = (t && this.state.rooms) ? this.props.classes.filter(c => c.name == t.class_name && c.subsection == t.subsection && c.teacher == t.teacher && c.block == t.block)[0] : null;
					var s2 = {};
					if ("0123456789".indexOf(cell[0]) >= 0) {
						cell = cell.split(" ").map((c, i) => [c, <br key={i} />]);
						s2.paddingTop = "1px"
					}
					if (cell == "LUNCH") {
						s2.paddingTop = "22.5%";
					}
					return <div key={i + "-" + j} className={cell == "SPORTS BUS" ? "sport" : ""} style={style}>
						<div className="absolute-fill" style={s2}>
							{cell}
							{t
								? [
									<div key={0} className="schedule-classname">{t.subsection == "" ? t.class_name : t.subsection}</div>,
									(this.state.rooms ? <div key={1} className="schedule-classroom">{c.room}</div> : null),
									<a key={2} className="button schedule-killbtn" onClick={() => killTicket(t.id, this.props.onChange)}>&times;</a>
								]
								: null}
						</div>
					</div>
				}))}
			</div>
			<ScheduleTable classes={this.props.classes} tickets={tickets} onChange={this.props.onChange} />
		</div>
	}
}
window.Schedule = Schedule;
