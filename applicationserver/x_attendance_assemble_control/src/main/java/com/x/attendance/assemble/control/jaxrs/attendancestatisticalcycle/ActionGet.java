package com.x.attendance.assemble.control.jaxrs.attendancestatisticalcycle;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.x.attendance.entity.AttendanceStatisticalCycle;
import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.entity.JpaObject;
import com.x.base.core.project.bean.WrapCopier;
import com.x.base.core.project.bean.WrapCopierFactory;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;

public class ActionGet extends BaseAction {
	
	protected ActionResult<Wo> execute( HttpServletRequest request, EffectivePerson effectivePerson, String id ) throws Exception {
		ActionResult<Wo> result = new ActionResult<>();
		Wo wrap = null;
		AttendanceStatisticalCycle attendanceStatisticalCycle = null;
		try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {

			attendanceStatisticalCycle = emc.find(id, AttendanceStatisticalCycle.class);

			if (attendanceStatisticalCycle != null) {
				// 将所有查询出来的有状态的对象转换为可以输出的过滤过属性的对象
				wrap = Wo.copier.copy(attendanceStatisticalCycle);
				// 对查询的列表进行排序
				result.setData(wrap);
			}

		} catch (Throwable th) {
			th.printStackTrace();
			result.error(th);
		}
		return result;
	}

	public static class Wo extends AttendanceStatisticalCycle  {
		
		private static final long serialVersionUID = -5076990764713538973L;

		public static WrapCopier<AttendanceStatisticalCycle, Wo> copier = 
				WrapCopierFactory.wo( AttendanceStatisticalCycle.class, Wo.class, null,JpaObject.FieldsInvisible);
	}

}